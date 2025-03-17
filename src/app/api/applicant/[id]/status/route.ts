import { NextResponse } from "next/server"
import { PrismaClient, ApplicationStatus } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = (await request.json()) as { status: ApplicationStatus }
    const { status } = body

    // Validate status
    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid application status" }, { status: 400 })
    }

    const updatedApplicant = await prisma.application.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        fullName: true,
        status: true,
      },
    })

    return NextResponse.json(updatedApplicant)
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
  }
}

