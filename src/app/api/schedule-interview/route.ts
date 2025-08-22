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

    // Parse and validate the time string
    const startTime = new Date(time)
    const endTime = new Date(startTime.getTime() + 45 * 60000) // 45 minutes later
    
    // Validate the time is not in the past (allow some buffer for scheduling)
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000)
    
    if (startTime < fiveMinutesAgo) {
      return NextResponse.json(
        { error: "Cannot schedule interviews in the past" }, 
        { status: 400 }
      )
    }
    
    // Validate the time is within business hours (8 AM - 10 PM)
    const hour = startTime.getHours()
    if (hour < 8 || hour >= 22) {
      return NextResponse.json(
        { error: "Interviews can only be scheduled between 8 AM and 10 PM" }, 
        { status: 400 }
      )
    }
    
    // Validate that the interview doesn't extend past 10 PM
    const endHour = endTime.getHours()
    const endMinute = endTime.getMinutes()
    if (endHour > 22 || (endHour === 22 && endMinute > 0)) {
      return NextResponse.json(
        { error: "Interview would extend past 10 PM business hours" }, 
        { status: 400 }
      )
    }
    
    // Check for time conflicts with existing interviews for this interviewer
    const conflictingInterviews = await db.interview.findMany({
      where: {
        interviewerId,
        OR: [
          // New interview overlaps with existing interview
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime }
          }
        ]
      },
      include: {
        applicant: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    })

    if (conflictingInterviews.length > 0) {
      return NextResponse.json(
        { 
          error: "Time slot conflicts with an existing interview",
          conflictingInterviews: conflictingInterviews.map(interview => ({
            id: interview.id,
            startTime: interview.startTime,
            endTime: interview.endTime,
            applicantName: interview.isPlaceholder ? interview.placeholderName : interview.applicant?.fullName,
            location: interview.location
          }))
        }, 
        { status: 409 }
      )
    }

    // Check for conflicts with the same applicant having other interviews at overlapping times
    if (!isPlaceholder && applicantId) {
      const applicantConflicts = await db.interview.findMany({
        where: {
          applicantId,
          OR: [
            // Same applicant has interview overlapping with this new time
            {
              startTime: { lt: endTime },
              endTime: { gt: startTime }
            }
          ]
        },
        include: {
          interviewer: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      if (applicantConflicts.length > 0) {
        return NextResponse.json(
          { 
            error: "Applicant already has a conflicting interview scheduled",
            conflictingInterviews: applicantConflicts.map(interview => ({
              id: interview.id,
              startTime: interview.startTime,
              endTime: interview.endTime,
              interviewerName: interview.interviewer?.name,
              location: interview.location
            }))
          }, 
          { status: 409 }
        )
      }
    }

    // Check for time conflicts with busy times
    const conflictingBusyTimes = await db.interviewerBusyTime.findMany({
      where: {
        interviewerId,
        OR: [
          // New interview overlaps with busy time
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime }
          }
        ]
      }
    })

    if (conflictingBusyTimes.length > 0) {
      return NextResponse.json(
        { 
          error: "Time slot conflicts with interviewer busy time",
          busyTimes: conflictingBusyTimes.map(bt => ({
            startTime: bt.startTime,
            endTime: bt.endTime,
            reason: bt.reason
          }))
        }, 
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

