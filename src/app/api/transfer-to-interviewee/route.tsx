import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    // Validate the incoming request
    let transfer;
    try {
      transfer = (await req.json()) as { applicantIds: string[] };
      console.log("Received transfer request:", transfer);
    } catch (err) {
      console.error("Error parsing request body:", err);
      return NextResponse.json(
        {
          error: "Invalid request body. Expected JSON with applicantIds array.",
        },
        { status: 400 },
      );
    }

    if (
      !transfer.applicantIds ||
      !Array.isArray(transfer.applicantIds) ||
      transfer.applicantIds.length === 0
    ) {
      return NextResponse.json(
        { error: "No applicants provided or invalid format." },
        { status: 400 },
      );
    }

    console.log("Attempting to transfer applicants:", transfer.applicantIds);

    // Update status to INTERVIEWING for selected applicants
    const result = await prisma.application.updateMany({
      where: {
        id: { in: transfer.applicantIds },
        // status: "PENDING",
      },
      data: {
        status: "INTERVIEWING",
        interviewStage: true,
      },
    });

    console.log(`Updated ${result.count} records to INTERVIEWING status`);

    return NextResponse.json({
      message: `Applicants transferred to interview stage successfully. Updated ${result.count} records.`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error transferring applicants:", error);
    return NextResponse.json(
      {
        error: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
