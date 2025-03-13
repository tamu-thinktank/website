import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Fetching interviewees with INTERVIEWING status");

    // Only get applicants with INTERVIEWING status
    const interviewees = await prisma.application.findMany({
      where: {
        status: "INTERVIEWING",
      },
      select: {
        id: true,
        fullName: true,
        major: true,
        year: true,
        preferredTeams: {
          select: { team: { select: { name: true } } },
        },
        researchAreas: {
          select: { researchArea: { select: { name: true } } },
        },
        applicationType: true,
        status: true,
        interviewerId: true,
        interviewTime: true,
        interviewDuration: true,
      },
    });

    console.log(
      `Found ${interviewees.length} interviewees with INTERVIEWING status`,
    );

    const formattedInterviewees = interviewees.map((applicant) => ({
      id: applicant.id,
      name: applicant.fullName,
      interests: applicant.researchAreas.map((pref) => pref.researchArea.name),
      teamRankings: applicant.preferredTeams.map((pref) => pref.team.name),
      major: applicant.major,
      year: applicant.year,
      rating: applicant.status,
      category: applicant.applicationType,
      interviewerId: applicant.interviewerId || null,
      interviewTime: applicant.interviewTime
        ? new Date(applicant.interviewTime)
        : null,
      interviewDuration: applicant.interviewDuration || 15, // Default to 15 minutes if not specified
    }));

    return NextResponse.json(formattedInterviewees);
  } catch (error) {
    console.error("Error fetching interviewees:", error);
    return NextResponse.json(
      {
        error: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Update an applicant's interview details
export async function PUT(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.id || !data.interviewerId || !data.interviewTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Update the applicant with interview details
    const updatedApplicant = await prisma.application.update({
      where: {
        id: data.id,
      },
      data: {
        interviewerId: data.interviewerId,
        interviewTime: new Date(data.interviewTime),
        interviewDuration: data.interviewDuration || 15, // Default to 15 minutes
      },
    });

    return NextResponse.json(updatedApplicant);
  } catch (error) {
    console.error("Error updating applicant interview details:", error);
    return NextResponse.json(
      {
        error: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
