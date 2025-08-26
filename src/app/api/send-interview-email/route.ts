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

    // Convert time to Central Time
    const centralTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(validatedData.startTime));

    // For now, just log the email data (in real implementation, this would send actual emails)
    console.log("Sending interview email:", {
      to: validatedData.applicantEmail,
      from: "lucasvad123@gmail.com", // Updated to use test email
      subject: "ThinkTank Application Interview",
      interviewer: validatedData.officerName,
      time: centralTime,
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