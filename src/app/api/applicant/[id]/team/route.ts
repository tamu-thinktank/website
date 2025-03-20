import { NextResponse } from "next/server"
import { db } from "@/lib/db"

interface TeamUpdateRequest {
  assignedTeam: string | null
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = (await request.json()) as TeamUpdateRequest

    console.log("Updating team for applicant:", id, "to:", body.assignedTeam)

    // Update the application with the new team
    const updatedApplicant = await db.application.update({
      where: { id },
      data: {
        assignedTeam: body.assignedTeam,
      },
      select: {
        id: true,
        fullName: true,
        assignedTeam: true,
      },
    })

    return NextResponse.json(updatedApplicant)
  } catch (error) {
    console.error("Error updating team assignment:", error)
    return NextResponse.json({ error: "Failed to update team assignment" }, { status: 500 })
  }
}

