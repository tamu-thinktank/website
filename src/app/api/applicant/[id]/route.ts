import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const applicant = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        applicationType: true,
        preferredName: true,
        uin: true,
        email: true,
        altEmail: true,
        phone: true,
        submittedAt: true,
        status: true,
        major: true,
        year: true,
        firstQuestion: true,
        secondQuestion: true,
        meetings: true,
        weeklyCommitment: true,
        preferredTeams: {
          include: {
            team: true,
          },
        },
        preferredPositions: true,
        timeCommitment: true,
        currentClasses: true,
        nextClasses: true,
        summerPlans: true,
        assignedTeam: true,
        resumeId: true
      },
    })

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    return NextResponse.json(applicant)
  } catch (error) {
    console.error("Error fetching applicant details:", error)
    return NextResponse.json({ error: "Failed to fetch applicant details" }, { status: 500 })
  }
}

