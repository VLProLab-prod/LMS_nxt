import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch Active courses (same as course list)
    const courses = await prisma.course.findMany({
      where: {
        status: "Active"
      },
      include: {
        sections: {
          include: {
            contents: {
              include: {
                assignedEditor: true,
                contentscript: {
                  select: {
                    pptFileData: true,
                    docFileData: true,
                    zipFileData: true
                  }
                }
              }
            }
          }
        },
        program: true
      }
    });

    // 2. Calculate stats from fetched courses
    let totalTopics = 0;
    let published = 0;
    let inEditing = 0;
    let scripted = 0;
    let underReview = 0;
    let readyForVideo = 0;

    const topicsInProgress = [];

    courses.forEach(course => {
      course.sections.forEach(section => {
        totalTopics += section.contents.length;

        section.contents.forEach(topic => {
          // Stats Counting
          if (topic.workflowStatus === "Published") published++;
          if (topic.workflowStatus === "Editing") inEditing++;
          if (topic.workflowStatus === "Scripted") scripted++;
          if (topic.workflowStatus === "Under_Review") underReview++;
          if (topic.workflowStatus === "ReadyForVideoPrep" || topic.workflowStatus === "Post_Editing") readyForVideo++;

          // Topics In Progress List (Everything except Published)
          if (topic.workflowStatus !== "Published") {
            topicsInProgress.push({
              content_id: topic.id,
              topic_title: topic.title,
              workflow_status: topic.workflowStatus, // Will be mapped below
              estimated_duration_min: topic.estimatedDurationMin,
              course_title: course.title,
              unit_title: section.title,
              program_name: course.program?.programName || "Unknown Program",
              video_link: topic.videoLink,
              review_notes: topic.reviewNotes,
              assignedEditor: topic.assignedEditor,
              has_ppt: !!topic.contentscript?.pptFileData,
              has_doc: !!topic.contentscript?.docFileData,
              has_zip: !!topic.contentscript?.zipFileData,
            });
          }
        });
      });
    });

    // Helper to map DB status to Frontend status
    const mapStatus = (status) => {
      const map = {
        "Post_Editing": "Ready_for_Video_Prep",
        "ReadyForVideoPrep": "Ready_for_Video_Prep",
        "Under_Review": "Under_Review",
        "Published": "Published"
      };
      return map[status] || status;
    };

    // 3. Format data
    const formattedTopics = topicsInProgress.map((topic) => ({
      content_id: topic.content_id,
      topic_title: topic.topic_title,
      workflow_status: mapStatus(topic.workflow_status),
      estimated_duration_min: topic.estimated_duration_min,
      course_title: topic.course_title,
      unit_title: topic.unit_title,
      program_name: topic.program_name,
      video_link: topic.video_link,
      review_notes: topic.review_notes,
      assigned_editor_name: topic.assignedEditor ? `${topic.assignedEditor.firstName || ''} ${topic.assignedEditor.lastName || ''}`.trim() : null,
      has_ppt: topic.has_ppt,
      has_doc: topic.has_doc,
      has_zip: topic.has_zip,
    }));

    return NextResponse.json({
      stats: {
        totalTopics,
        published,
        inEditing,
        scripted,
        underReview,
        readyForVideo,
      },
      topicsInProgress: formattedTopics,
    });
  } catch (error) {
    console.error("Error fetching editor dashboard data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
