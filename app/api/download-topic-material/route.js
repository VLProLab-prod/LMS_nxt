import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");
    const type = searchParams.get("type"); // 'ppt', 'doc', 'zip'

    if (!topicId || !type) {
        return NextResponse.json({ error: "Missing topicId or type" }, { status: 400 });
    }

    try {
        const script = await prisma.contentscript.findUnique({
            where: { contentId: parseInt(topicId) },
        });

        if (!script) {
            return NextResponse.json({ error: "Script not found" }, { status: 404 });
        }

        // Fetch topic details for naming
        const topic = await prisma.contentItem.findUnique({
            where: { id: parseInt(topicId) },
            include: { section: true }
        });

        const unitIndex = topic?.section?.orderIndex || 0;

        let topicIndex = 0;
        if (topic && topic.section) {
            const topics = await prisma.contentItem.findMany({
                where: { sectionId: topic.section.id },
                orderBy: { id: 'asc' },
                select: { id: true }
            });
            topicIndex = topics.findIndex(t => t.id === parseInt(topicId)) + 1;
        }

        const unitNumber = unitIndex;
        const topicNumber = topicIndex;
        const topicName = topic.title || "Topic";
        const profName = topic.section?.profName || "Prof";

        // Sanitize filename to remove invalid characters
        const sanitize = (str) => str.replace(/[^a-zA-Z0-9 \-_]/g, "").trim();

        const filenameBase = `U_${String(unitNumber).padStart(2, '0')}V_${String(topicNumber).padStart(2, '0')} - ${sanitize(topicName)} - ${sanitize(profName)}`;

        let fileData = null;
        let filename = `${filenameBase}.${type}`;
        let contentType = "application/octet-stream";

        if (type === "ppt") {
            fileData = script.pptFileData;
            filename = `${filenameBase}.pptx`;
            contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        } else if (type === "doc") {
            fileData = script.docFileData;
            filename = `${filenameBase}.docx`;
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (type === "zip") {
            fileData = script.zipFileData;
            filename = `${filenameBase}-materials.zip`;
            contentType = "application/zip";
        }

        if (!fileData) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const response = new NextResponse(fileData);
        response.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
        response.headers.set("Content-Type", contentType);

        return response;
    } catch (err) {
        console.error("Download error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
