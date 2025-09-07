import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Redis not available, return mock health status
    return NextResponse.json({
      redis: { status: "unavailable", message: "Redis not configured" },
      cache: { status: "disabled" },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        error: "Failed to check system health",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
