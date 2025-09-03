import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: applicantId } = await params;

    const notes = await prisma.interviewNote.findMany({
      where: { applicantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching interview notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview notes" },
      { status: 500 },
    );
  }
}
