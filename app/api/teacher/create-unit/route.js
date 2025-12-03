import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();

    const course_id = form.get("course_id");
    const unit_title = form.get("unit_title");


    if (!course_id || !unit_title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure the course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(course_id) },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Calculate the next order_index for the new unit
    const nextOrderIndex = await prisma.courseSection.aggregate({
      where: { courseId: parseInt(course_id) },
      _max: { orderIndex: true },
    });

    const orderIndex = (nextOrderIndex._max.orderIndex || 0) + 1;

    // Generate Unit Code: UNIT--01, UNIT--02, etc.
    const unitCode = `UNIT--${String(orderIndex).padStart(2, '0')}`;

    // Create section (Unit)
    const section = await prisma.courseSection.create({
      data: {
        courseId: parseInt(course_id),
        title: unit_title,
        orderIndex: orderIndex,
        unitCode: unitCode,
        profName: "TBD", // Default value as we aren't asking for it anymore
      },
    });

    return NextResponse.json({
      success: true,
      message: "Unit created and files stored successfully",
    });
  } catch (err) {
    console.error("create-unit route error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
