import { NextResponse } from "next/server"
import { PrismaClient, ApplicationStatus } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { applicantId, interviewerId, time, location, teamId } = body as {
      applicantId: string
      interviewerId: string
      time: string
      location: string
      teamId?: string
    }

    if (!applicantId || !interviewerId || !time || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the interview
    const interview = await prisma.interview.create({
      data: {
        applicantId,
        interviewerId,
        startTime: new Date(time),
        endTime: new Date(new Date(time).getTime() + 15 * 60000), // 15 minutes later
        location,
        teamId: teamId || undefined, // Add teamId if provided
      },
    })

    // Update the application status to INTERVIEWING if it's not already
    await prisma.application.updateMany({
      where: {
        id: applicantId,
        NOT: {
          status: ApplicationStatus.INTERVIEWING,
        },
      },
      data: {
        status: ApplicationStatus.INTERVIEWING,
      },
    })

    return NextResponse.json(interview)
  } catch (error) {
    console.error("Error scheduling interview:", error)
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 })
  }
}

