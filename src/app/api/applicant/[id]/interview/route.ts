import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find the most recent interview for this applicant
    const interview = await db.interview.findFirst({
      where: { applicantId: id },
      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!interview) {
      return NextResponse.json(
        { error: "No interview found for this applicant" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: interview.id,
      startTime: interview.startTime,
      endTime: interview.endTime,
      location: interview.location,
      teamId: interview.teamId,
      interviewer: interview.interviewer,
    })
  } catch (error) {
    console.error("Error fetching interview details:", error)
    return NextResponse.json(
      { error: "Failed to fetch interview details" },
      { status: 500 }
    )
  }
}