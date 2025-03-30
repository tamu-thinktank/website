import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const interviewerId = params.id
    const url = new URL(request.url)
    const timeParam = url.searchParams.get("time")

    if (!timeParam) {
      return NextResponse.json({ error: "Time parameter is required" }, { status: 400 })
    }

    const checkTime = new Date(timeParam)

    // Define a 30-minute buffer before and after the requested time
    const bufferMs = 30 * 60 * 1000 // 30 minutes in milliseconds
    const startBuffer = new Date(checkTime.getTime() - bufferMs)
    const endBuffer = new Date(checkTime.getTime() + bufferMs)

    // Check if the interviewer has any interviews scheduled within the buffer period
    const existingInterviews = await db.interview.findMany({
      where: {
        interviewerId,
        startTime: {
          gte: startBuffer,
          lte: endBuffer,
        },
      },
    })

    return NextResponse.json({
      hasConflict: existingInterviews.length > 0,
      conflictingInterviews: existingInterviews,
    })
  } catch (error) {
    console.error("Error checking interviewer schedule:", error)
    return NextResponse.json({ error: "Failed to check interviewer schedule" }, { status: 500 })
  }
}

