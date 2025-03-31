import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Only get applicants with ACCEPTED status
    const members = await prisma.application.findMany({
      where: {
        status: "ACCEPTED",
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
        assignedTeam: true,
      },
    });

    const formattedMembers = members.map((applicant) => ({
      id: applicant.id,
      name: applicant.fullName,
      interests: applicant.researchAreas.map((pref) => pref.researchArea.name),
      teamRankings: applicant.preferredTeams.map((pref) => pref.team.name),
      major: applicant.major,
      year: applicant.year,
      rating: applicant.status,
      category: applicant.applicationType,
      assignedTeam: applicant.assignedTeam,
    }));

    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
