// app/api/statistics/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || "2024-2025";
    const team = searchParams.get("team") || "DC";

    // Get all applications with their relationships
    const applications = await prisma.application.findMany({
      where: {
        // You might need to add a seasonYear field to your Application model
        // or filter by submittedAt date range corresponding to the season
      },
      include: {
        preferredTeams: {
          include: {
            team: true,
          },
        },
        researchAreas: {
          include: {
            researchArea: true,
          },
        },
        timeCommitment: true,
      },
    });

    // Filter applications by team preference
    const teamApplications = applications.filter((app) =>
      app.preferredTeams.some((pref) => pref.team.name === team),
    );

    // Calculate statistics
    const stats = {
      global: {
        applicants: applications.length,
        interviewees: applications.filter((app) => app.status !== "PENDING")
          .length,
        members: applications.filter((app) => app.status === "ACCEPTED").length,
      },
      team: {
        name: team,
        applicants: teamApplications.length,
        interviewees: teamApplications.filter((app) => app.status !== "PENDING")
          .length,
        members: teamApplications.filter((app) => app.status === "ACCEPTED")
          .length,
      },
      demographics: {
        majors: calculateRatios(applications, "major"),
        years: calculateRatios(applications, "year"),
        genders: calculateRatios(applications, "gender"),
      },
      teamDemographics: {
        majors: calculateRatios(teamApplications, "major"),
        years: calculateRatios(teamApplications, "year"),
        genders: calculateRatios(teamApplications, "gender"),
      },
      referralSources: calculateReferralSources(applications),
      teamPreferences: calculateTeamPreferences(applications),
      researchInterests: calculateResearchInterests(teamApplications, team),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}

// Helper function to calculate ratios
function calculateRatios(applications: any[], field: string) {
  const counts: Record<string, number> = {};

  applications.forEach((app) => {
    const value = app[field] || "Unknown";
    counts[value] = (counts[value] || 0) + 1;
  });

  const total = applications.length;
  const ratios: Record<string, { count: number; percentage: number }> = {};

  for (const [key, count] of Object.entries(counts)) {
    ratios[key] = {
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    };
  }

  return ratios;
}

// Calculate referral sources
function calculateReferralSources(applications: any[]) {
  const counts: Record<string, number> = {};

  applications.forEach((app) => {
    if (Array.isArray(app.referral)) {
      app.referral.forEach((source: string) => {
        counts[source] = (counts[source] || 0) + 1;
      });
    }
  });

  const total = applications.length;
  const ratios: Record<string, { count: number; percentage: number }> = {};

  for (const [key, count] of Object.entries(counts)) {
    ratios[key] = {
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    };
  }

  return ratios;
}

// Calculate team preferences with interest scoring
function calculateTeamPreferences(applications: any[]) {
  const counts: Record<
    string,
    {
      count: number;
      highInterest: number;
      mediumInterest: number;
      lowInterest: number;
      score: number;
    }
  > = {};

  applications.forEach((app) => {
    app.preferredTeams.forEach((pref: any) => {
      const teamName = pref.team.name;

      if (!counts[teamName]) {
        counts[teamName] = {
          count: 0,
          highInterest: 0,
          mediumInterest: 0,
          lowInterest: 0,
          score: 0,
        };
      }

      counts[teamName].count += 1;

      // Add interest level counts
      if (pref.interest === "HIGH") {
        counts[teamName].highInterest += 1;
        counts[teamName].score += 3; // Weighting: HIGH = 3 points
      } else if (pref.interest === "MEDIUM") {
        counts[teamName].mediumInterest += 1;
        counts[teamName].score += 2; // Weighting: MEDIUM = 2 points
      } else if (pref.interest === "LOW") {
        counts[teamName].lowInterest += 1;
        counts[teamName].score += 1; // Weighting: LOW = 1 point
      }
    });
  });

  return counts;
}

// Calculate research interests for a specific team
function calculateResearchInterests(applications: any[], team: string) {
  const counts: Record<
    string,
    {
      count: number;
      highInterest: number;
      mediumInterest: number;
      lowInterest: number;
      score: number;
    }
  > = {};

  applications.forEach((app) => {
    app.researchAreas.forEach((pref: any) => {
      const researchName = pref.researchArea.name;

      if (!counts[researchName]) {
        counts[researchName] = {
          count: 0,
          highInterest: 0,
          mediumInterest: 0,
          lowInterest: 0,
          score: 0,
        };
      }

      counts[researchName].count += 1;

      // Add interest level counts
      if (pref.interest === "HIGH") {
        counts[researchName].highInterest += 1;
        counts[researchName].score += 3; // Weighting: HIGH = 3 points
      } else if (pref.interest === "MEDIUM") {
        counts[researchName].mediumInterest += 1;
        counts[researchName].score += 2; // Weighting: MEDIUM = 2 points
      } else if (pref.interest === "LOW") {
        counts[researchName].lowInterest += 1;
        counts[researchName].score += 1; // Weighting: LOW = 1 point
      }
    });
  });

  return counts;
}
