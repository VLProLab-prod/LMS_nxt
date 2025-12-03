import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { topicId, newStatus } = await request.json();

    if (!topicId || !newStatus) {
      return new NextResponse("Missing topicId or newStatus", { status: 400 });
    }

    // Map frontend status to DB enum if needed
    let dbStatus = newStatus;
    if (newStatus === "Post-Editing") dbStatus = "Post_Editing";
    if (newStatus === "Ready_for_Video_Prep") dbStatus = "ReadyForVideoPrep";
    if (newStatus === "Under_Review") dbStatus = "Under_Review";

    const updateData = {
      workflowStatus: dbStatus,
    };

    // If moving to Post-Editing (Start Recording), assign the current user
    if (newStatus === "Post-Editing") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const userId = cookieStore.get("userId")?.value;

      if (userId) {
        updateData.assignedEditorId = parseInt(userId);
      }
    }

    const updatedTopic = await prisma.contentItem.update({
      where: {
        id: parseInt(topicId),
      },
      data: updateData,
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Error updating topic status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
