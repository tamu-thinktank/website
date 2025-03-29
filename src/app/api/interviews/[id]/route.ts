import { NextResponse } from "next/server"
import { db } from "@/lib/db"

interface UpdateInterviewRequest {
  location?: string
  teamId?: string
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = (await request.json()) as UpdateInterviewRequest

    // Validate the request body
    if (!body.location && !body.teamId) {
      return NextResponse.json({ error: "At least one field to update must be provided" }, { status: 400 })
    }

    // Prepare the update data
    const updateData: { location?: string; teamId?: string } = {}
    if (body.location) updateData.location = body.location
    if (body.teamId) updateData.teamId = body.teamId

    // Update the interview
    const updatedInterview = await db.interview.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedInterview)
  } catch (error) {
    console.error("Error updating interview:", error)
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete the interview
    await db.interview.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting interview:", error)
    return NextResponse.json({ error: "Failed to delete interview" }, { status: 500 })
  }
}

