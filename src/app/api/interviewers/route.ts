import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Challenge } from "@prisma/client"

export async function GET() {
  try {
    console.log("📋 [INTERVIEWERS API] Fetching all interviewers...")
    const interviewers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        targetTeams: true,
        interviews: {
          include: {
            applicant: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    })

    console.log(`📋 [INTERVIEWERS API] Found ${interviewers.length} interviewer(s)`)
    interviewers.forEach(interviewer => {
      console.log(`  - ${interviewer.name} (${interviewer.email}) - Teams: [${interviewer.targetTeams?.join(', ') || 'none'}]`)
    })

    if (interviewers.length === 0) {
      console.warn("⚠️  [INTERVIEWERS API] No interviewers found. Users need to log in first to create interviewer accounts.")
    }

    return NextResponse.json(interviewers)
  } catch (error) {
    console.error("❌ [INTERVIEWERS API] Error fetching interviewers:", error)
    return NextResponse.json({ error: "Failed to fetch interviewers" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      interviewerId: string
      targetTeams?: string[]
    }

    const { interviewerId, targetTeams } = body

    if (!interviewerId) {
      return NextResponse.json({ error: "Interviewer ID is required" }, { status: 400 })
    }

    // Validate and clean targetTeams array
    const validTargetTeams = targetTeams?.filter((team) => team && typeof team === 'string' && team.trim().length > 0)

    console.log(`Updating targetTeams for interviewer ${interviewerId}:`, {
      original: targetTeams,
      filtered: validTargetTeams
    })

    // Get current interviewer to see existing data
    const currentInterviewer = await db.user.findUnique({
      where: { id: interviewerId },
      select: { targetTeams: true, name: true }
    })

    console.log(`Current targetTeams for ${currentInterviewer?.name}:`, currentInterviewer?.targetTeams)

    const updatedInterviewer = await db.user.update({
      where: { id: interviewerId },
      data: {
        targetTeams: validTargetTeams || [], // Ensure we always provide an array
      },
      select: {
        id: true,
        name: true,
        email: true,
        targetTeams: true,
      },
    })

    console.log(`Updated targetTeams for ${updatedInterviewer.name}:`, updatedInterviewer.targetTeams)

    return NextResponse.json(updatedInterviewer)
  } catch (error) {
    console.error("Error updating interviewer:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to update interviewer"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

