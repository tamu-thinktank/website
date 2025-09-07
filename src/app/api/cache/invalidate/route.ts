import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type: string;
      interviewerId?: string;
      dates?: string[];
    };
    const { type } = body;

    // Cache invalidation not available without Redis, return success
    console.log(`Cache invalidation requested for type: ${type} (skipped - no Redis)`);

    return NextResponse.json({
      success: true,
      type,
      message: "Cache invalidation skipped (Redis not available)",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cache invalidation error:", error);
    return NextResponse.json(
      {
        error: "Failed to invalidate cache",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
