import { NextResponse } from "next/server";
import { z } from "zod";
import sendEmail from "@/server/service/email";
import { InterviewEmail } from "../../../../emails/interview";

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
  // New fields for separate interviewer and interviewee emails
  sendToInterviewer: z.boolean().optional().default(true),
  sendToInterviewee: z.boolean().optional().default(true),
  intervieweeTimeOffset: z.number().optional().default(15), // offset in minutes for interviewee
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = SendInterviewEmailSchema.parse(body);

    const baseStartTime = new Date(validatedData.startTime);

    // Convert interviewer time (actual start time) to Central Time
    const interviewerCentralTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(baseStartTime);

    // Calculate interviewee time with offset, handling edge cases
    // For interviews shorter than the offset time, use the original time
    // For interviews that would extend past business hours, cap the offset
    let offsetMinutes = validatedData.intervieweeTimeOffset;

    // Standard interview duration is 45 minutes
    const interviewDuration = 45;

    // If the offset is greater than or equal to the interview duration, use original time
    if (offsetMinutes >= interviewDuration) {
      offsetMinutes = 0;
      console.log(
        "📧 [EMAIL] Interview duration too short for offset, using original time",
      );
    }

    // Check if offset would go past 10 PM business hours
    const potentialEndTime = new Date(
      baseStartTime.getTime() + offsetMinutes * 60000,
    );
    const endHour = potentialEndTime.getHours();

    if (endHour >= 22) {
      // 10 PM or later
      offsetMinutes = 0;
      console.log(
        "📧 [EMAIL] Offset would extend past business hours, using original time",
      );
    }

    const intervieweeStartTime = new Date(
      baseStartTime.getTime() + offsetMinutes * 60000,
    );
    const intervieweeCentralTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(intervieweeStartTime);

    const emailResults: string[] = [];

    // Send email to interviewer with actual start time
    if (validatedData.sendToInterviewer) {
      console.log("📧 [EMAIL] Sending interview email to interviewer:", {
        to: validatedData.officerEmail,
        subject: "ThinkTank Interview - Interviewer Notification",
        interviewer: validatedData.officerName,
        time: interviewerCentralTime,
        location: validatedData.location,
        team: validatedData.team,
        applicationType: validatedData.applicationType,
      });

      try {
        const interviewerEmailResult = await sendEmail({
          to: [validatedData.officerEmail],
          subject: "ThinkTank Interview - Interviewer Notification",
          template: InterviewEmail({
            userFirstname:
              validatedData.officerName.split(" ")[0] ??
              validatedData.officerName,
            time: interviewerCentralTime,
            location: validatedData.location,
            interviewerName: validatedData.officerName,
            team: validatedData.team,
            applicationType: validatedData.applicationType ?? "General",
          }),
        });

        emailResults.push(
          `Interviewer email: ${String(interviewerEmailResult)}`,
        );
        console.log(
          "✅ [EMAIL] Interviewer email sent successfully:",
          interviewerEmailResult,
        );
      } catch (emailError) {
        console.error(
          "❌ [EMAIL] Failed to send interviewer email:",
          emailError,
        );
        throw new Error(
          `Failed to send interviewer email: ${String(emailError)}`,
        );
      }
    }

    // Send email to interviewee with offset time
    if (validatedData.sendToInterviewee) {
      console.log("📧 [EMAIL] Sending interview email to interviewee:", {
        to: "lucasvad123@gmail.com", // Testing with your email
        originalTo: validatedData.applicantEmail,
        subject: "ThinkTank Application Interview",
        interviewer: validatedData.officerName,
        time: intervieweeCentralTime,
        location: validatedData.location,
        team: validatedData.team,
        applicationType: validatedData.applicationType,
      });

      try {
        const intervieweeEmailResult = await sendEmail({
          to: ["lucasvad123@gmail.com"], // Send to test email
          subject: "ThinkTank Application Interview",
          template: InterviewEmail({
            userFirstname:
              validatedData.applicantName.split(" ")[0] ??
              validatedData.applicantName,
            time: intervieweeCentralTime, // Use offset time for interviewee
            location: validatedData.location,
            interviewerName: validatedData.officerName,
            team: validatedData.team,
            applicationType: validatedData.applicationType ?? "General",
          }),
        });

        emailResults.push(
          `Interviewee email: ${String(intervieweeEmailResult)}`,
        );
        console.log(
          "✅ [EMAIL] Interviewee email sent successfully:",
          intervieweeEmailResult,
        );
      } catch (emailError) {
        console.error(
          "❌ [EMAIL] Failed to send interviewee email:",
          emailError,
        );
        throw new Error(
          `Failed to send interviewee email: ${String(emailError)}`,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Interview emails sent successfully",
      results: emailResults,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error sending interview email:", error);
    return NextResponse.json(
      { error: "Failed to send interview email" },
      { status: 500 },
    );
  }
}
