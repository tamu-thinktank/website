import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const transfer = (await req.json()) as { applicantIds: string[] };

    if (!transfer.applicantIds || transfer.applicantIds.length === 0) {
      return NextResponse.json(
        { error: "No applicants provided." },
        { status: 400 },
      );
    }

    console.log(
      "Attempting to transfer interviewees to ACCEPTED:",
      transfer.applicantIds,
    );

    // Update status to ACCEPTED for selected interviewees
    const result = await prisma.application.updateMany({
      where: {
        id: { in: transfer.applicantIds },
        status: "INTERVIEWING", // Only update if current status is INTERVIEWING
      },
      data: { status: "ACCEPTED" },
    });

    console.log(`Updated ${result.count} records to ACCEPTED status`);

    return NextResponse.json({
      message: `Interviewees transferred to member status successfully. Updated ${result.count} records.`,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Error transferring interviewees:", error);
    return NextResponse.json(
      {
        error: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
