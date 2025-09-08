import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// We'll keep prisma for future use
const _prisma = new PrismaClient();

// Define the interview type
interface Interview {
  id: string;
  applicantId: string;
  applicantName: string;
  interviewerId: string;
  startTime: Date;
  endTime: Date;
  teamId: string;
  location: string;
}

// Properly type the interviews array
const interviews: Interview[] = [];

export function GET() {
  try {
    // Return the mock interviews
    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Type the data properly
    const body = await request.json();

    // Type assertion with validation
    const data = body as {
      applicantId?: string;
      applicantName?: string;
      interviewerId?: string;
      startTime?: string;
      endTime?: string;
      teamId?: string;
      location?: string;
    };

    // Validate required fields
    if (
      !data.applicantId ||
      !data.interviewerId ||
      !data.startTime ||
      !data.endTime ||
      !data.teamId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create a new interview with proper typing
    const interview: Interview = {
      id: Math.random().toString(36).substring(2, 9),
      applicantId: data.applicantId,
      applicantName: data.applicantName ?? "Unknown",
      interviewerId: data.interviewerId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      teamId: data.teamId,
      location: data.location ?? "TBD",
    };

    // Add to our mock storage
    interviews.push(interview);

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 },
    );
  }
}
