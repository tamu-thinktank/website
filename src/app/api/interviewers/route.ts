import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Challenge } from "@prisma/client";

export async function GET() {
  try {
    const interviewers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        targetTeams: true,
        interviews: {
          include: {
            applicant: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(interviewers);
  } catch (error) {
    console.error("Error fetching interviewers:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviewers" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      interviewerId: string;
      targetTeams?: Challenge[];
    };

    const { interviewerId, targetTeams } = body;

    if (!interviewerId) {
      return NextResponse.json(
        { error: "Interviewer ID is required" },
        { status: 400 },
      );
    }

    // Ensure targetTeams is an array of valid Challenge enums
    const validTargetTeams = targetTeams?.filter((team) =>
      Object.values(Challenge).includes(team),
    );

    const updatedInterviewer = await db.user.update({
      where: { id: interviewerId },
      data: {
        targetTeams: validTargetTeams ? { set: validTargetTeams } : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        targetTeams: true,
      },
    });

    return NextResponse.json(updatedInterviewer);
  } catch (error) {
    console.error("Error updating interviewer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update interviewer";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
