import { NextResponse } from "next/server"
import { PrismaClient, ApplicationType } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // Get the applicationType from the URL query parameters
    const url = new URL(request.url)
    const applicationType = url.searchParams.get("applicationType") ?? "OFFICER"

    console.log(`Fetching statistics for application type: ${applicationType}`)

    // Validate the applicationType
    if (!Object.values(ApplicationType as Record<string, string>).includes(applicationType)) {
      return NextResponse.json({ error: `Invalid application type: ${applicationType}` }, { status: 400 })
    }

    // Get all applications of the specified type
    const applications = await prisma.application.findMany({
      where: {
        applicationType: applicationType as keyof typeof ApplicationType,
      },
      select: {
        id: true,
        fullName: true,
        gender: true,
        year: true,
        major: true,
        referral: true,
        status: true,
      },
    })

    console.log(`Found ${applications.length} applications of type ${applicationType}`)

    // Process the data to get the statistics
    const genders: Record<string, number> = {}
    const years: Record<string, number> = {}
    const majors: Record<string, number> = {}
    const referrals: Record<string, number> = {}
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      INTERVIEWING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    }

    // Detailed data for the dialog
    const detailedData = {
      genders: [] as { name: string; value: string }[],
      years: [] as { name: string; value: string }[],
      referrals: [] as { name: string; value: string }[],
      majors: [] as { name: string; value: string }[],
    }

    applications.forEach((app) => {
      // Count genders
      if (app.gender) {
        genders[app.gender] = (genders[app.gender] ?? 0) + 1
        detailedData.genders.push({ name: app.fullName, value: app.gender })
      }

      // Count years
      years[app.year as string] = (years[app.year as string] ?? 0) + 1
      detailedData.years.push({ name: app.fullName, value: app.year })

      // Count majors
      majors[app.major] = (majors[app.major] ?? 0) + 1
      detailedData.majors.push({ name: app.fullName, value: app.major })

      // Count referral sources
      if (Array.isArray(app.referral)) {
        (app.referral as string[]).forEach((ref) => {
          referrals[ref] = (referrals[ref] ?? 0) + 1
          detailedData.referrals.push({ name: app.fullName, value: ref })
        })
      }

      // Count statuses
      statusCounts[app.status] = (statusCounts[app.status] ?? 0) + 1
    })

    return NextResponse.json({
      genders,
      years,
      majors,
      referrals,
      statusCounts,
      detailedData,
    })
  } catch (error) {
    console.error("Error generating statistics:", error)
    return NextResponse.json({ error: "Failed to generate statistics" }, { status: 500 })
  }
}

