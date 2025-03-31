import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {

    const applicants = await prisma.application.findMany({

      select: {
        id: true,
        fullName: true,
        major: true,
        year: true,
        subteamPreferences: {
          select: {
            name: true,
            interest: true
          }
        },
        learningInterests: {
          select: {
            area: true,
            interestLevel: true
          }
        },
        preferredPositions: {
          select: {
            position: true,
            interest: true
          }
        },
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
      interests: applicant.learningInterests.map((pref) => ({
        area: pref.area,
        interest: pref.interestLevel
      })),
      officerpos: applicant.preferredPositions.map((pref) => ({
        position: pref.position,
        interest: pref.interest
      })),
      teamRankings: applicant.preferredTeams.map((pref) => pref.team.name),
      subTeam: applicant.subteamPreferences.map((pref) => ({
        name: pref.name,
        interest: pref.interest
      })),
      major: applicant.major,
      year: applicant.year,
      rating: applicant.status,
      category: applicant.applicationType,
    }))

    return NextResponse.json(formattedApplicants)
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

