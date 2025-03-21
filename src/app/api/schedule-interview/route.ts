import { NextResponse } from "next/server"
import { ApplicationStatus } from "@prisma/client"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { applicantId, interviewerId, time, location } = body as {
      applicantId: string
      interviewerId: string
      time: string
      location: string
    }

    if (!applicantId || !interviewerId || !time || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the applicant and interviewer details
    const [applicant, interviewer] = await Promise.all([
      db.application.findUnique({
        where: { id: applicantId },
        select: {
          id: true,
          fullName: true,
          email: true,
          status: true,
        },
      }),
      db.user.findUnique({
        where: { id: interviewerId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
    ])

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    if (!interviewer) {
      return NextResponse.json({ error: "Interviewer not found" }, { status: 404 })
    }

    // Create the interview
    const interview = await db.interview.create({
      data: {
        applicantId,
        interviewerId,
        startTime: new Date(time),
        endTime: new Date(new Date(time).getTime() + 15 * 60000), // 15 minutes later
        location,
      },
    })

    // Update the application status to INTERVIEWING if it's not already
    if (applicant.status !== ApplicationStatus.INTERVIEWING) {
      await db.application.update({
        where: { id: applicantId },
        data: {
          status: ApplicationStatus.INTERVIEWING,
        },
      })

      console.log(`Status updated for ${applicant.fullName}: ${applicant.status} -> INTERVIEWING`)
    }

    // Log interview scheduling
    console.log(
      `Interview scheduled for ${applicant.fullName} with ${interviewer.name} at ${new Date(time).toLocaleString()} in ${location}`,
    )

    return NextResponse.json(interview)
  } catch (error) {
    console.error("Error scheduling interview:", error)
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 })
  }
}

