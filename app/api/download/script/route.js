import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const topicId = searchParams.get("topicId");
        const type = searchParams.get("type"); // ppt, doc, zip

        if (!topicId || !type) {
            return NextResponse.json({ error: "Missing topicId or type" }, { status: 400 });
        }

        const script = await prisma.contentscript.findUnique({
            where: { contentId: parseInt(topicId) },
        });

        if (!script) {
            return NextResponse.json({ error: "Script not found" }, { status: 404 });
        }

        let fileData = null;
        let filename = `Topic_${topicId}_${type}`;
        let contentType = "application/octet-stream";

        if (type === "ppt") {
            fileData = script.pptFileData;
            filename += ".pptx"; // Defaulting to pptx
            contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        } else if (type === "doc") {
            fileData = script.docFileData;
            filename += ".pdf"; // Defaulting to pdf, but could be docx
            contentType = "application/pdf";
        } else if (type === "zip") {
            fileData = script.zipFileData;
            filename += ".zip";
            contentType = "application/zip";
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        if (!fileData) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Convert Buffer to Blob-like response
        const headers = new Headers();
        headers.set("Content-Type", contentType);
        headers.set("Content-Disposition", `attachment; filename="${filename}"`);

        return new NextResponse(fileData, {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error("Download error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
