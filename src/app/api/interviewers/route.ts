import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const interviewers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(interviewers)
  } catch (error) {
    console.error("Error fetching interviewers:", error)
    return NextResponse.json({ error: "Failed to fetch interviewers" }, { status: 500 })
  }
}

