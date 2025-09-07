import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicationType = searchParams.get("applicationType") ?? "DCMEMBER";

  try {
    // Fetch applications filtered by applicationType
    const applications = await prisma.application.findMany({
      where: {
        applicationType: applicationType as
          | "OFFICER"
          | "MATEROV"
          | "DCMEMBER"
          | "MINIDC", // Cast to the correct enum type
      },
      select: {
        id: true,
        fullName: true,
        gender: true,
        year: true,
        referral: true,
        major: true,
        status: true,
      },
    });

    // Helper function to count occurrences
    const countOccurrences = (arr: Record<string, unknown>[], key: string) => {
      return arr.reduce(
        (acc, obj) => {
          // Handle array fields like referral which is ReferralSource[]
          if (Array.isArray(obj[key])) {
            obj[key].forEach((value: unknown) => {
              const stringValue = String(value);
              acc[stringValue] = ((acc[stringValue] as number) || 0) + 1;
            });
          } else {
            const value = String(obj[key] ?? "Unknown"); // Handle null values
            acc[value] = ((acc[value] as number) || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );
    };

    // Count applications by status
    const statusCounts = applications.reduce(
      (acc, app) => {
        const status = String(app.status);
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Create detailed data for tables
    const createDetailedData = (key: string) => {
      return applications.map((app) => {
        let value;
        const appValue = app[key as keyof typeof app];
        if (Array.isArray(appValue)) {
          value = (appValue as unknown[]).join(", ");
        } else {
          value = appValue ?? "Unknown";
        }
        return {
          name: app.fullName,
          value: value.toString(),
        };
      });
    };

    // Calculate statistics
    const stats = {
      genders: countOccurrences(applications, "gender"),
      years: countOccurrences(applications, "year"),
      referrals: countOccurrences(applications, "referral"),
      majors: countOccurrences(applications, "major"),
      statusCounts,
      detailedData: {
        genders: createDetailedData("gender"),
        years: createDetailedData("year"),
        referrals: createDetailedData("referral"),
        majors: createDetailedData("major"),
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
