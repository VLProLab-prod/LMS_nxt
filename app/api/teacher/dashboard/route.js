import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

import { cookies } from "next/headers";

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userIdInt = parseInt(userId);

        // 1. Fetch courses assigned to user (Active only) to ensure consistency with "Your Courses"
        const courses = await prisma.course.findMany({
            where: {
                status: "Active",
                assignments: {
                    some: {
                        userId: userIdInt
                    }
                }
            },
            include: {
                sections: {
                    include: {
                        contents: true
                    }
                }
            }
        });

        // 2. Calculate stats from the fetched courses
        let totalTopics = 0;
        let totalUnits = 0;
        let videosToReview = 0;
        let videosPublished = 0;

        courses.forEach(course => {
            totalUnits += course.sections.length;
            course.sections.forEach(section => {
                totalTopics += section.contents.length;
                section.contents.forEach(topic => {
                    if (topic.workflowStatus === "Under_Review") {
                        videosToReview++;
                    }
                    if (topic.workflowStatus === "Published") {
                        videosPublished++;
                    }
                });
            });
        });

        // 3. Fetch topics for review list (using the same filter logic)
        // We can actually extract this from the courses we just fetched to be perfectly consistent,
        // but for pagination/sorting purposes usually a separate query is better. 
        // However, to guarantee consistency, let's filter the already fetched data.

        const topicsForReview = [];
        courses.forEach(course => {
            course.sections.forEach(section => {
                section.contents.forEach(topic => {
                    if (topic.workflowStatus === "Under_Review") {
                        topicsForReview.push({
                            content_id: topic.id,
                            topic_title: topic.title,
                            workflow_status: "Under_Review",
                            estimated_duration_min: topic.estimatedDurationMin,
                            course_id: course.id,
                            course_title: course.title,
                            unit_title: section.title,
                            program_name: "Unknown Program", // We didn't fetch program in the main query to save bandwidth, can fetch if needed or just leave as is since it's minor
                            videoLink: topic.videoLink
                        });
                    }
                });
            });
        });

        return NextResponse.json({
            stats: {
                totalTopics,
                totalUnits,
                videosToReview,
                videosPublished
            },
            topicsForReview
        });

    } catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
