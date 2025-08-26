import { NextResponse } from "next/server"
import { z } from "zod"
import sendEmail from "@/server/service/email"
import { RejectAppEmail } from "../../../../emails/reject-app"

const SendRejectionEmailSchema = z.object({
  applicantName: z.string(),
  applicantEmail: z.string().email(),
  applicationType: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = SendRejectionEmailSchema.parse(body)

    // Log the email data for debugging
    console.log("📧 [EMAIL] Sending rejection email:", {
      to: "lucasvad123@gmail.com", // Testing with your email
      originalTo: validatedData.applicantEmail,
      subject: "ThinkTank Application Update",
      applicant: validatedData.applicantName,
      applicationType: validatedData.applicationType,
    })

    try {
      // Actually send the email using your email service
      const emailResult = await sendEmail({
        to: ["lucasvad123@gmail.com"], // Send to your test email
        subject: "ThinkTank Application Update",
        template: RejectAppEmail({
          userFirstname: validatedData.applicantName.split(' ')[0] || validatedData.applicantName,
        }),
      })
      
      console.log("✅ [EMAIL] Rejection email sent successfully:", emailResult)
    } catch (emailError) {
      console.error("❌ [EMAIL] Failed to send rejection email:", emailError)
      throw emailError
    }

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