import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        applicant: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Transform the data to match the expected format
    const formattedInterviews = interviews.map((interview) => ({
      id: interview.id,
      applicantId: interview.applicantId,
      interviewerId: interview.interviewerId,
      startTime: interview.startTime.toISOString(),
      endTime: interview.endTime.toISOString(),
      location: interview.location,
      teamId: interview.teamId,
      isPlaceholder: interview.isPlaceholder,
      placeholderName: interview.placeholderName,
      applicant: interview.applicant,
    }));

    return NextResponse.json(formattedInterviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}