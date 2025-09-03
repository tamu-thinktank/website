import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TeamUpdateRequest {
  assignedTeam: string | null;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const body = (await request.json()) as TeamUpdateRequest;
    const { assignedTeam } = body;

    // Update the application with the assigned team
    const updatedApplicant = await prisma.application.update({
      where: { id },
      data: {
        assignedTeam,
      },
      select: {
        id: true,
        fullName: true,
        assignedTeam: true,
      },
    });

    return NextResponse.json(updatedApplicant);
  } catch (error) {
    console.error("Error updating team assignment:", error);
    return NextResponse.json(
      { error: "Failed to update team assignment" },
      { status: 500 },
    );
  }
}
