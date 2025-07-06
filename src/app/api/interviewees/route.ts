import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Fetching interviewees with INTERVIEWING status");

    // Only get applicants with INTERVIEWING status
    const interviewees = await prisma.application.findMany({
      where: {
        OR: [{ status: "INTERVIEWING" }, { status: "REJECTED_INT" }],
      },
      select: {
        id: true,
        fullName: true,
        major: true,
        year: true,
        subteamPreferences: {
          select: {
            name: true,
            interest: true,
          },
        },
        learningInterests: {
          select: {
            area: true,
            interestLevel: true,
          },
        },
        preferredPositions: {
          select: {
            position: true,
            interest: true,
          },
        },
        preferredTeams: {
          select: { team: { select: { name: true } } },
        },
        researchAreas: {
          select: { researchArea: { select: { name: true } } },
        },
        applicationType: true,
      },
    });

    console.log(
      `Found ${interviewees.length} interviewees with INTERVIEWING status`,
    );

    const formattedInterviewees = interviewees.map((applicant) => ({
      id: applicant.id,
      name: applicant.fullName,
      interests: applicant.learningInterests.map((pref) => ({
        area: pref.area,
        interest: pref.interestLevel,
      })),
      officerpos: applicant.preferredPositions.map((pref) => ({
        position: pref.position,
        interest: pref.interest,
      })),
      teamRankings: applicant.preferredTeams.map((pref) => pref.team.name),
      subTeam: applicant.subteamPreferences.map((pref) => ({
        name: pref.name,
        interest: pref.interest,
      })),
      major: applicant.major,
      year: applicant.year,

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
