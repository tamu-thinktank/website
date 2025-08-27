import { NextResponse } from "next/server"
import { z } from "zod"
import sendEmail from "@/server/service/email"
import { InterviewEmail } from "../../../../emails/interview"

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

    // Log the email data for debugging
    console.log("📧 [EMAIL] Sending interview email:", {
      to: "lucasvad123@gmail.com", // Testing with your email
      originalTo: validatedData.applicantEmail,
      subject: "ThinkTank Application Interview",
      interviewer: validatedData.officerName,
      time: centralTime,
      location: validatedData.location,
      team: validatedData.team,
      applicationType: validatedData.applicationType,
    })

    try {
      // Actually send the email using your email service
      const emailResult = await sendEmail({
        to: ["lucasvad123@gmail.com"], // Send to your test email
        subject: "ThinkTank Application Interview",
        template: InterviewEmail({
          userFirstname: validatedData.applicantName.split(' ')[0] ?? validatedData.applicantName,
          time: centralTime,
          location: validatedData.location,
          interviewerName: validatedData.officerName,
          team: validatedData.team,
          applicationType: validatedData.applicationType || "General",
        }),
      })
      
      console.log("✅ [EMAIL] Interview email sent successfully:", emailResult)
    } catch (emailError) {
      console.error("❌ [EMAIL] Failed to send interview email:", emailError)
      throw emailError
    }

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