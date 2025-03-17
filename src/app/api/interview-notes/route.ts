import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { applicantId, content, interviewerId } = body as {
      applicantId: string
      content: string
      interviewerId?: string
    }

    if (!applicantId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a new interview note
    // Use the provided interviewerId or get it from the session in your actual implementation
    const note = await prisma.interviewNote.create({
      data: {
        applicantId,
        interviewerId: interviewerId || "default-interviewer-id", // Replace with actual logic
        content,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error creating interview note:", error)
    return NextResponse.json({ error: "Failed to create interview note" }, { status: 500 })
  }
}

