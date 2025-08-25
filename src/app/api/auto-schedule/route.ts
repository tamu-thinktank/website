import { NextResponse } from "next/server"
import { z } from "zod"
import { autoScheduleInterview, findAvailableSlots } from "@/server/services/auto-scheduler"
import { Challenge } from "@prisma/client"

const AutoScheduleSchema = z.object({
  intervieweeId: z.string().cuid(),
  preferredTeams: z.array(z.string()),
  availableSlots: z.array(z.object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    date: z.string().datetime()
  })),
  autoCreateInterview: z.boolean().optional().default(false)  // New parameter for automatic booking
})

const FindSlotsSchema = z.object({
  interviewerId: z.string().cuid(),
  date: z.string().datetime()
})

// POST: Auto-schedule interview for an interviewee
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = AutoScheduleSchema.parse(body)
    
    // Convert date strings to Date objects
    const availableSlots = validatedData.availableSlots.map(slot => ({
      hour: slot.hour,
      minute: slot.minute,
      date: new Date(slot.date)
    }))
    
    const result = await autoScheduleInterview({
      intervieweeId: validatedData.intervieweeId,
      preferredTeams: validatedData.preferredTeams,
      availableSlots,
      autoCreateInterview: validatedData.autoCreateInterview
    })
    
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Auto-scheduling error:", error)
    return NextResponse.json(
      { error: "Failed to auto-schedule interview" },
      { status: 500 }
    )
  }
}

// GET: Find available slots for an interviewer
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const interviewerId = searchParams.get('interviewerId')
    const date = searchParams.get('date')
    
    if (!interviewerId || !date) {
      return NextResponse.json(
        { error: "Both interviewerId and date are required" },
        { status: 400 }
      )
    }
    
    const validatedData = FindSlotsSchema.parse({
      interviewerId,
      date
    })
    
    const availableSlots = await findAvailableSlots(
      validatedData.interviewerId,
      new Date(validatedData.date)
    )
    
    return NextResponse.json({ availableSlots })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Find slots error:", error)
    return NextResponse.json(
      { error: "Failed to find available slots" },
      { status: 500 }
    )
  }
}