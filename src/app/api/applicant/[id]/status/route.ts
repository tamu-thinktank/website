import { NextResponse } from "next/server"
import { ApplicationStatus } from "@prisma/client"
import { db } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as { status: ApplicationStatus }
    const { status } = body

    // Validate status
    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid application status" }, { status: 400 })
    }

    // Get the applicant details before updating (we need this for email sending)
    const applicant = await db.application.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        assignedTeam: true,
      },
    })

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    // Update the application status
    const updatedApplicant = await db.application.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        assignedTeam: true,
      },
    })

    // Log status change
    console.log(`Status updated for ${applicant.fullName} (${applicant.email}): ${applicant.status} -> ${status}`)

    return NextResponse.json(updatedApplicant)
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
  }
}

