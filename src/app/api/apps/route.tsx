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
