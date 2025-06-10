import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface NoteRequest {
  applicantId: string
  content: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NoteRequest

    if (!body.applicantId || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { applicantId, content } = body

    // Format the current date and time
    const timestamp = new Date().toLocaleString()

    // Check if an interview note exists for this applicant
    const existingNote = await prisma.interviewNote.findFirst({
      where: { applicantId },
    })

    let updatedNote

    if (existingNote) {
      // Append to the existing note instead of replacing it
      const newContent = `${existingNote.content}\n\n${timestamp}: ${content}`

      updatedNote = await prisma.interviewNote.update({
        where: { id: existingNote.id },
        data: { content: newContent },
      })
    } else {
      // Create a new note if none exists - with timestamp
      const timestampedContent = `${timestamp}: ${content}`

      updatedNote = await prisma.interviewNote.create({
        data: {
          applicantId,
          content: timestampedContent,
        },
      })
    }

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("Error updating interview note:", error)
    return NextResponse.json({ error: "Failed to update interview note" }, { status: 500 })
  }
}

// Also support PATCH for consistency
export async function PATCH(_request: Request) {
  return POST(_request)
}

