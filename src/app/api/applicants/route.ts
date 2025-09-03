import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SchedulerCache } from "@/lib/redis";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Try to get cached applicants first
    const cached = await SchedulerCache.getApplicants("pending-rejected");
    if (cached) {
      console.log("Returning cached applicants data");
      return NextResponse.json(cached);
    }

    const applicants = await prisma.application.findMany({
      where: {
        OR: [
          { status: "PENDING" },
          { status: "REJECTED_APP" },
          { status: "REJECTED" },
        ],
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
        status: true,
        rating: true,
      },
    });

    const formattedApplicants = applicants.map((applicant) => ({
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
      major: applicant.major,
      year: applicant.year,
      rating: applicant.rating, // Actual rating from 1-5
      category: applicant.applicationType,
      status: applicant.status, // PENDING, INTERVIEWING, etc.
      subTeam: applicant.subteamPreferences.map((pref) => ({
        name: pref.name,
        interest: pref.interest,
      })),
    }));

    // Cache the formatted results
    await SchedulerCache.setApplicants(formattedApplicants, "pending-rejected");
    console.log("Cached applicants data for future requests");

    return NextResponse.json(formattedApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
