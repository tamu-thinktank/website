import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    
    const applicants = await prisma.application.findMany({
      where: {
        AND: [
          {
            interviewStage: false,
          },
          {
            OR: [
              { status: "PENDING" },
              { status: "REJECTED" }
            ]
          }
        ]
      },
      select: {
        id: true,
        fullName: true,
        major: true,
        year: true,
        preferredTeams: {
          select: { team: { select: { name: true } } },
        },
        researchAreas: {
          select: { researchArea: { select: { name: true } } },
        },
        applicationType: true,
        status: true,
      },
    })

    const formattedApplicants = applicants.map((applicant) => ({
      id: applicant.id,
      name: applicant.fullName,
      interests: applicant.researchAreas.map((pref) => pref.researchArea.name),
      teamRankings: applicant.preferredTeams.map((pref) => pref.team.name),
      major: applicant.major,
      year: applicant.year,
      rating: applicant.status,
      category: applicant.applicationType,
      status: applicant.status,
    }))

    return NextResponse.json(formattedApplicants)
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

