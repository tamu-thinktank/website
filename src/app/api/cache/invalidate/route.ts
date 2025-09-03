import { NextResponse } from "next/server";
import { SchedulerCache } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type: string;
      interviewerId?: string;
      dates?: string[];
    };
    const { type, interviewerId, dates } = body;

    switch (type) {
      case "busyTimes":
        if (interviewerId) {
          await SchedulerCache.invalidateBusyTimes(interviewerId);

          // Also invalidate availability cache for affected dates
          if (dates && Array.isArray(dates)) {
            for (const date of dates) {
              try {
                await SchedulerCache.invalidateInterviewer(interviewerId);
              } catch (error) {
                console.warn(
                  `Failed to invalidate availability cache for ${interviewerId}:${date}`,
                );
              }
            }
          }
        }
        break;

      case "interviews":
        if (dates && Array.isArray(dates)) {
          for (const date of dates) {
            await SchedulerCache.invalidateInterviews(date as string);
          }
        } else {
          await SchedulerCache.invalidateInterviews();
        }
        break;

      case "interviewer":
        if (interviewerId) {
          await SchedulerCache.invalidateInterviewer(interviewerId);
        }
        break;

      case "all":
        await SchedulerCache.invalidateAll();
        break;

      default:
        return NextResponse.json(
          { error: "Invalid invalidation type" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      type,
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
