import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Mock interviewers to be created if they don't exist
const mockInterviewers = [
  { name: "Aiden", email: "aiden@example.com" },
  { name: "Moksh", email: "moksh@example.com" },
  { name: "1", email: "interviewer1@example.com" },
  { name: "2", email: "interviewer2@example.com" },
]

export async function GET() {
  try {
    const createdInterviewers = []

    // Create each interviewer if they don't exist
    for (const interviewer of mockInterviewers) {
      const existingInterviewer = await prisma.user.findFirst({
        where: { name: interviewer.name },
      })

      if (!existingInterviewer) {
        const newInterviewer = await prisma.user.create({
          data: {
            name: interviewer.name,
            email: interviewer.email,
          },
        })
        createdInterviewers.push(newInterviewer)
      }
    }

    return NextResponse.json({
      message: `Created ${createdInterviewers.length} mock interviewers`,
      interviewers: createdInterviewers,
    })
  } catch (error) {
    console.error("Error creating mock interviewers:", error)
    return NextResponse.json({ error: "Failed to create mock interviewers" }, { status: 500 })
  }
}

