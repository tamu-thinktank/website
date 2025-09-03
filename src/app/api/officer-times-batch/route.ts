import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      interviewerIds: string[];
      timeSlots: string[];
    };
    const { interviewerIds, timeSlots } = body;

    if (!interviewerIds || !timeSlots) {
      return NextResponse.json(
        { error: "Missing interviewerIds or timeSlots" },
        { status: 400 },
      );
    }

    // Build OR conditions for all the time slot queries
    const whereConditions = [];

    for (const interviewerId of interviewerIds) {
      for (const gridTime of timeSlots) {
        whereConditions.push({
          officerId: interviewerId,
          gridTime: gridTime,
        });
      }
    }

    // Fetch all officer times in a single query using OR conditions
    const officerTimes = await db.officerTime.findMany({
      where: {
        OR: whereConditions,
      },
      select: {
        officerId: true,
        gridTime: true,
        selectedAt: true,
      },
    });

    // Group results by interviewerId and gridTime for easier lookup
    const grouped: Record<string, Record<string, boolean>> = {};

    for (const interviewerId of interviewerIds) {
      grouped[interviewerId] = {};
      for (const gridTime of timeSlots) {
        grouped[interviewerId][gridTime] = false;
      }
    }

    // Mark the slots that exist in the database
    for (const officerTime of officerTimes) {
      if (grouped[officerTime.officerId]) {
        grouped[officerTime.officerId]![officerTime.gridTime] = true;
      }
    }

    return NextResponse.json({ availability: grouped });
  } catch (error) {
    console.error("Error fetching officer times batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch officer times" },
      { status: 500 },
    );
  }
}
