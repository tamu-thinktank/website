import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateBusyTimeSchema = z.object({
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  reason: z.string().optional().nullable(),
});

// GET: Fetch specific busy time by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const busyTime = await db.interviewerBusyTime.findUnique({
      where: { id },
      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!busyTime) {
      return NextResponse.json(
        { error: "Busy time not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(busyTime);
  } catch (error) {
    console.error("Error fetching busy time:", error);
    return NextResponse.json(
      { error: "Failed to fetch busy time" },
      { status: 500 },
    );
  }
}

// PATCH: Update specific busy time
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = UpdateBusyTimeSchema.parse(body);

    // Check if busy time exists
    const existingBusyTime = await db.interviewerBusyTime.findUnique({
      where: { id },
      include: {
        interviewer: {
          select: { id: true, name: true },
        },
      },
    });

    if (!existingBusyTime) {
      return NextResponse.json(
        { error: "Busy time not found" },
        { status: 404 },
      );
    }

    // Prepare update data with existing values as fallback
    const updateData: any = {};

    if (validatedData.startTime !== undefined) {
      updateData.startTime = new Date(validatedData.startTime);
    }

    if (validatedData.endTime !== undefined) {
      updateData.endTime = new Date(validatedData.endTime);
    }

    if (validatedData.reason !== undefined) {
      updateData.reason = validatedData.reason;
    }

    // Validate time range if both times are provided or being updated
    const finalStartTime = updateData.startTime || existingBusyTime.startTime;
    const finalEndTime = updateData.endTime || existingBusyTime.endTime;

    if (finalStartTime >= finalEndTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 },
      );
    }

    // Check for overlapping busy times (excluding current one)
    const overlapping = await db.interviewerBusyTime.findMany({
      where: {
        id: { not: id },
        interviewerId: existingBusyTime.interviewerId,
        OR: [
          {
            startTime: { lt: finalEndTime },
            endTime: { gt: finalStartTime },
          },
        ],
      },
    });

    if (overlapping.length > 0) {
      return NextResponse.json(
        {
          error: "Updated busy time would overlap with existing busy period",
          conflicting: overlapping,
        },
        { status: 409 },
      );
    }

    // Check for interview conflicts
    const conflictingInterviews = await db.interview.findMany({
      where: {
        interviewerId: existingBusyTime.interviewerId,
        OR: [
          {
            startTime: { lt: finalEndTime },
            endTime: { gt: finalStartTime },
          },
        ],
      },
    });

    if (conflictingInterviews.length > 0) {
      return NextResponse.json(
        {
          error: "Updated busy time would conflict with existing interviews",
          conflicting: conflictingInterviews,
        },
        { status: 409 },
      );
    }

    // Update the busy time
    const updatedBusyTime = await db.interviewerBusyTime.update({
      where: { id },
      data: updateData,
      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(
      `Updated busy time for ${existingBusyTime.interviewer.name}: ${finalStartTime.toLocaleString()} - ${finalEndTime.toLocaleString()}`,
    );

    return NextResponse.json(updatedBusyTime);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating busy time:", error);
    return NextResponse.json(
      { error: "Failed to update busy time" },
      { status: 500 },
    );
  }
}

// DELETE: Remove specific busy time
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Check if busy time exists
    const existingBusyTime = await db.interviewerBusyTime.findUnique({
      where: { id },
      include: {
        interviewer: {
          select: { id: true, name: true },
        },
      },
    });

    if (!existingBusyTime) {
      return NextResponse.json(
        { error: "Busy time not found" },
        { status: 404 },
      );
    }

    await db.interviewerBusyTime.delete({
      where: { id },
    });

    console.log(
      `Deleted busy time for ${existingBusyTime.interviewer.name}: ${existingBusyTime.startTime.toLocaleString()} - ${existingBusyTime.endTime.toLocaleString()}`,
    );

    return NextResponse.json({
      message: "Busy time deleted successfully",
      deleted: existingBusyTime,
    });
  } catch (error) {
    console.error("Error deleting busy time:", error);
    return NextResponse.json(
      { error: "Failed to delete busy time" },
      { status: 500 },
    );
  }
}
