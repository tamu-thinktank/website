import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get all applicants with INTERVIEWING status
    const applicants = await prisma.application.findMany({
      where: {
        status: "INTERVIEWING",
        interviewerId: null, // Only get unassigned applicants
      },
      include: {
        meetingTimes: true,
        preferredTeams: {
          include: {
            team: true,
          },
        },
      },
    });

    // Get all officers (interviewers) with their availability
    const interviewers = await prisma.user.findMany({
      include: {
        availability: true,
        targetTeams: true,
      },
    });

    // Track successful matches
    const matches = [];
    const unmatched = [];

    // For each applicant, find the best interviewer match
    for (const applicant of applicants) {
      // Get applicant's available times
      const applicantTimes = applicant.meetingTimes.map(
        (time) => time.gridTime,
      );

      // Get applicant's preferred teams
      const applicantTeams = applicant.preferredTeams.map((pref) => ({
        teamId: pref.teamId,
        interest: pref.interest,
      }));

      // Score each interviewer based on availability and team match
      const scoredInterviewers = interviewers.map((interviewer) => {
        // Get interviewer's available times
        const interviewerTimes = interviewer.availability.map(
          (time) => time.gridTime,
        );

        // Find common available times
        const commonTimes = applicantTimes.filter((time) =>
          interviewerTimes.includes(time),
        );

        // Calculate availability score (0-100)
        const availabilityScore =
          commonTimes.length > 0
            ? Math.min(
                100,
                (commonTimes.length / Math.min(applicantTimes.length, 10)) *
                  100,
              )
            : 0;

        // Calculate team match score (0-100)
        let teamMatchScore = 0;

        // Check if interviewer's target teams match applicant's preferred teams
        for (const interviewerTeam of interviewer.targetTeams) {
          const matchingTeam = applicantTeams.find(
            (team) => team.teamId === interviewerTeam,
          );

          if (matchingTeam) {
            // Weight by interest level
            if (matchingTeam.interest === "HIGH") {
              teamMatchScore += 100;
            } else if (matchingTeam.interest === "MEDIUM") {
              teamMatchScore += 70;
            } else {
              teamMatchScore += 40;
            }
          }
        }

        // Normalize team match score
        teamMatchScore = Math.min(100, teamMatchScore);

        // Calculate total score (weighted average)
        // Availability is more important (60%), team match is secondary (40%)
        const totalScore = availabilityScore * 0.6 + teamMatchScore * 0.4;

        return {
          interviewer,
          commonTimes,
          availabilityScore,
          teamMatchScore,
          totalScore,
        };
      });

      // Sort interviewers by total score (highest first)
      scoredInterviewers.sort((a, b) => b.totalScore - a.totalScore);

      // Get the best match (if any)
      const bestMatch = scoredInterviewers[0];

      if (
        bestMatch &&
        bestMatch.totalScore > 0 &&
        bestMatch.commonTimes.length > 0
      ) {
        // We have a match!
        const selectedTime = bestMatch.commonTimes[0]; // Pick the first common time

        // Update the applicant with the interviewer and interview time
        await prisma.application.update({
          where: { id: applicant.id },
          data: {
            interviewerId: bestMatch.interviewer.id,
            interviewTime: selectedTime,
            interviewDuration: 30, // Default to 30 minutes
          },
        });

        matches.push({
          applicantId: applicant.id,
          applicantName: applicant.fullName,
          interviewerId: bestMatch.interviewer.id,
          interviewerName: bestMatch.interviewer.name,
          interviewTime: selectedTime,
          score: bestMatch.totalScore,
        });
      } else {
        // No suitable match found
        unmatched.push({
          applicantId: applicant.id,
          applicantName: applicant.fullName,
          reason:
            bestMatch.totalScore === 0
              ? "No matching score"
              : "No common availability",
        });
      }
    }

    return NextResponse.json({
      success: true,
      matched: matches.length,
      unmatched: unmatched.length,
      matches,
      unmatched,
    });
  } catch (error) {
    console.error("Error matching applicants with interviewers:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
