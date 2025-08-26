import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const UpdateRatingSchema = z.object({
  rating: z.number().min(1).max(5).nullable(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const validatedData = UpdateRatingSchema.parse(body)
    const { rating } = validatedData

    console.log(`Updating rating for applicant ${id}: ${rating}`)

    // Update the applicant's rating
    const updatedApplicant = await db.application.update({
      where: { id },
      data: { rating },
      select: {
        id: true,
        fullName: true,
        rating: true,
      },
    })

    console.log(`Successfully updated rating for ${updatedApplicant.fullName}`)

    return NextResponse.json({
      success: true,
      applicant: updatedApplicant,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid rating value. Must be between 1 and 5, or null." },
        { status: 400 }
      )
    }

    console.error("Error updating applicant rating:", error)
    return NextResponse.json(
      { error: "Failed to update rating" },
      { status: 500 }
    )
  }
}