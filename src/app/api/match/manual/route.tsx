import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      applicantId,
      interviewerId,
      interviewTime,
      duration = 30,
    } = await request.json();

    // Validate required fields
    if (!applicantId || !interviewerId || !interviewTime) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Update the applicant with the interviewer and interview time
    const updatedApplicant = await prisma.application.update({
      where: { id: applicantId },
      data: {
        interviewerId,
        interviewTime,
        interviewDuration: duration,
      },
    });

    return NextResponse.json({
      success: true,
      applicant: updatedApplicant,
    });
  } catch (error) {
    console.error("Error manually matching applicant with interviewer:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
