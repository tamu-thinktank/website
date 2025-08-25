import { NextResponse } from "next/server"
import { z } from "zod"

const SendInterviewEmailSchema = z.object({
  officerId: z.string(),
  officerName: z.string(),
  officerEmail: z.string().email(),
  applicantName: z.string(),
  applicantEmail: z.string().email(),
  startTime: z.string(),
  location: z.string(),
  team: z.string().optional(),
  applicationType: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = SendInterviewEmailSchema.parse(body)

    // For now, just log the email data (in real implementation, this would send actual emails)
    console.log("Sending interview email:", {
      to: validatedData.applicantEmail,
      from: "lucasvad123@gmail.com", // Updated to use test email
      subject: `Interview Scheduled - ${validatedData.applicationType || "General"} Application`,
      interviewer: validatedData.officerName,
      time: validatedData.startTime,
      location: validatedData.location,
      team: validatedData.team,
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ 
      success: true, 
      message: "Interview email sent successfully" 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error sending interview email:", error)
    return NextResponse.json(
      { error: "Failed to send interview email" },
      { status: 500 }
    )
  }
}