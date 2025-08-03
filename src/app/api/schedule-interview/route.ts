import { NextResponse } from "next/server"
import { ApplicationStatus } from "@prisma/client"
import { db } from "@/lib/db"

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
      applicantName = null 
    } = body as {
      applicantId?: string
      interviewerId: string
      time: string
      location: string
      teamId?: string
      isPlaceholder?: boolean
      applicantName?: string | null
    }

    // For reserved slots, we don't need an applicantId but we need a name
    if ((!applicantId && !isPlaceholder) || !interviewerId || !time || !location) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Parse the time string
    const startTime = new Date(time)
    const endTime = new Date(startTime.getTime() + 45 * 60000) // 45 minutes later
    
    // Check for time conflicts
    const conflictingInterviews = await db.interview.findMany({
      where: {
        interviewerId,
        OR: [
          // New interview starts during an existing interview
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime }
          },
          // New interview ends during an existing interview
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime }
          },
          // New interview completely contains an existing interview
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime }
          }
        ]
      }
    })

    if (conflictingInterviews.length > 0) {
      return NextResponse.json(
        { error: "Time slot conflicts with an existing interview" }, 
        { status: 400 }
      )
    }

    // Get the interviewer details
    const interviewer = await db.user.findUnique({
      where: { id: interviewerId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!interviewer) {
      return NextResponse.json({ error: "Interviewer not found" }, { status: 404 })
    }

    // For regular interviews, verify the applicant exists
    if (!isPlaceholder) {
      const applicant = await db.application.findUnique({
        where: { id: applicantId },
        select: {
          id: true,
          fullName: true,
          email: true,
          status: true,
        },
      })

      if (!applicant) {
        return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
      }

      // Update the application status to INTERVIEWING if it's not already
      if (applicant.status !== ApplicationStatus.INTERVIEWING) {
        await db.application.update({
          where: { id: applicantId },
          data: {
            status: ApplicationStatus.INTERVIEWING,
            assignedTeam: teamId,
          },
        })
        console.log(`Status updated for ${applicant.fullName}: ${applicant.status} -> INTERVIEWING`)
      }
    }

    // Create the interview
    const interview = await db.interview.create({
      data: {
        applicantId: isPlaceholder ? null : applicantId,
        interviewerId,
        startTime,
        endTime,
        location,
        teamId,
        isPlaceholder,
        placeholderName: isPlaceholder ? (applicantName || "Reserved Slot") : null,
      },
      include: {
        applicant: isPlaceholder ? false : {
          select: { fullName: true }
        }
      }
    })

    // Log the scheduling
    const logName = isPlaceholder 
      ? `Reserved slot (${applicantName || 'No name'})` 
      : interview.applicant?.fullName || 'Unknown applicant'
      
    console.log(
      `Interview scheduled for ${logName} with ${interviewer.name} at ${startTime.toLocaleString()} in ${location}`
    )

    return NextResponse.json({
      ...interview,
      applicantName: isPlaceholder ? (applicantName || "Reserved Slot") : interview.applicant?.fullName
    })
  } catch (error) {
    console.error("Error scheduling interview:", error)
    return NextResponse.json(
      { error: "Failed to schedule interview. Please try again later." }, 
      { status: 500 }
    )
  }
}

