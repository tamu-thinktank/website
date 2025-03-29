import { NextResponse } from "next/server"
import { PrismaClient, ApplicationStatus } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      applicantId,
      interviewerId,
      time,
      location,
      teamId,
      isPlaceholder = false,
      applicantName = "Reserved Slot",
    } = body as {
      applicantId?: string
      interviewerId: string
      time: string
      location: string
      teamId?: string
      isPlaceholder?: boolean
      applicantName?: string
    }

    if (!interviewerId || !time || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the interview
    const interview = await prisma.interview.create({
      data: {
        applicantId: isPlaceholder ? null : applicantId,
        interviewerId,
        startTime: new Date(time),
        endTime: new Date(new Date(time).getTime() + 15 * 60000), // 15 minutes later
        location,
        teamId,
        isPlaceholder,
        placeholderName: isPlaceholder ? applicantName : null,
      },
      include: {
        applicant: {
          select: {
            fullName: true,
          },
        },
        interviewer: {
          select: {
            name: true,
          },
        },
      },
    })

    // Update the application status to INTERVIEWING if it's not already and if not a placeholder
    if (applicantId && !isPlaceholder) {
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
    }

    return NextResponse.json(interview)
  } catch (error) {
    console.error("Error scheduling interview:", error)
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        applicant: {
          select: {
            fullName: true,
          },
        },
        interviewer: {
          select: {
            name: true,
            targetTeams: true,
          },
        },
      },
    })

    return NextResponse.json(interviews)
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}

