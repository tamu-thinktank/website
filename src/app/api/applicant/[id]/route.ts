import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SchedulerCache } from "@/lib/redis";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Try to get cached applicant first
    const cached = await SchedulerCache.getApplicant(id);
    if (cached) {
      console.log(`Returning cached applicant data for ${id}`);
      return NextResponse.json(cached);
    }

    const applicant = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        applicationType: true,
        preferredName: true,
        uin: true,
        email: true,
        altEmail: true,
        phone: true,
        submittedAt: true,
        status: true,
        major: true,
        year: true,
        firstQuestion: true,
        secondQuestion: true,
        thirdQuestion: true,
        meetings: true,
        weeklyCommitment: true,
        preferredTeams: {
          include: {
            team: true,
          },
        },
        preferredPositions: true,
        timeCommitment: true,
        currentClasses: true,
        nextClasses: true,
        summerPlans: true,
        assignedTeam: true,
        resumeId: true,
        rating: true,
        subteamPreferences: true,
        referral: true,
        officerCommitment: true,
        skills: true,
        learningInterests: true,
        previousParticipation: true,
      },
    });

    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 },
      );
    }

    // Cache the applicant data
    await SchedulerCache.setApplicant(id, applicant);
    console.log(`Cached applicant data for ${id}`);

    return NextResponse.json(applicant);
  } catch (error) {
    console.error("Error fetching applicant details:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicant details" },
      { status: 500 },
    );
  }
}
