import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating busy times
const CreateBusyTimeSchema = z.object({
  interviewerId: z.string().cuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  reason: z.string().optional(),
});

const UpdateBusyTimeSchema = z.object({
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  reason: z.string().optional(),
});

// GET: Fetch busy times for interviewer(s)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const interviewerId = searchParams.get("interviewerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: any = {};

    if (interviewerId) {
      where.interviewerId = interviewerId;
    }

    if (startDate && endDate) {
      where.OR = [
        // Busy time starts within the range
        {
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        // Busy time ends within the range
        {
          endTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        // Busy time spans the entire range
        {
          startTime: { lte: new Date(startDate) },
          endTime: { gte: new Date(endDate) },
        },
      ];
    }

    const busyTimes = await db.interviewerBusyTime.findMany({
      where,
      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(busyTimes);
  } catch (error) {
    console.error("Error fetching busy times:", error);
    return NextResponse.json(
      { error: "Failed to fetch busy times" },
      { status: 500 },
    );
  }
}

// POST: Create new busy time interval
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreateBusyTimeSchema.parse(body);

    const { interviewerId, startTime, endTime, reason } = validatedData;

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 },
      );
    }

    // Check if interviewer exists
    const interviewer = await db.user.findUnique({
      where: { id: interviewerId },
      select: { id: true, name: true },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer not found" },
        { status: 404 },
      );
    }

    // Check for overlapping busy times
    const overlapping = await db.interviewerBusyTime.findMany({
      where: {
        interviewerId,
        OR: [
          // New busy time starts during an existing one
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (overlapping.length > 0) {
      return NextResponse.json(
        {
          error: "Busy time overlaps with existing busy period",
          conflicting: overlapping,
        },
        { status: 409 },
      );
    }

    // Check for interview conflicts
    const conflictingInterviews = await db.interview.findMany({
      where: {
        interviewerId,
        OR: [
          // New busy time conflicts with existing interview
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflictingInterviews.length > 0) {
      return NextResponse.json(
        {
          error: "Busy time conflicts with existing interviews",
          conflicting: conflictingInterviews,
        },
        { status: 409 },
      );
    }

    // Create the busy time
    const busyTime = await db.interviewerBusyTime.create({
      data: {
        interviewerId,
        startTime: start,
        endTime: end,
        reason,
      },
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
      `Created busy time for ${interviewer.name}: ${start.toLocaleString()} - ${end.toLocaleString()}`,
    );

    return NextResponse.json(busyTime, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating busy time:", error);
    return NextResponse.json(
      { error: "Failed to create busy time" },
      { status: 500 },
    );
  }
}

// DELETE: Remove all busy times for an interviewer (with query params)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const interviewerId = searchParams.get("interviewerId");

    if (!interviewerId) {
      return NextResponse.json(
        { error: "Interviewer ID is required" },
        { status: 400 },
      );
    }

    const deleted = await db.interviewerBusyTime.deleteMany({
      where: {
        interviewerId,
      },
    });

    return NextResponse.json({
      message: `Deleted ${deleted.count} busy time entries`,
      deleted: deleted.count,
    });
  } catch (error) {
    console.error("Error deleting busy times:", error);
    return NextResponse.json(
      { error: "Failed to delete busy times" },
      { status: 500 },
    );
  }
}
