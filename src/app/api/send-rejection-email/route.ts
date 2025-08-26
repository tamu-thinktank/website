import { NextResponse } from "next/server"
import { z } from "zod"

const SendRejectionEmailSchema = z.object({
  applicantName: z.string(),
  applicantEmail: z.string().email(),
  applicationType: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = SendRejectionEmailSchema.parse(body)

    // For now, just log the email data (in real implementation, this would send actual emails)
    console.log("Sending rejection email:", {
      to: validatedData.applicantEmail,
      from: "lucasvad123@gmail.com", // Updated to use test email
      subject: "ThinkTank Application Update",
      applicant: validatedData.applicantName,
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ 
      success: true, 
      message: "Rejection email sent successfully" 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error sending rejection email:", error)
    return NextResponse.json(
      { error: "Failed to send rejection email" },
      { status: 500 }
    )
  }
}