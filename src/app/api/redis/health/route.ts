import { NextResponse } from "next/server"
import { SchedulerCache } from "@/lib/redis"

export async function GET() {
  try {
    const health = await SchedulerCache.healthCheck()
    const stats = await SchedulerCache.getStats()
    
    return NextResponse.json({
      redis: health,
      cache: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Redis health check error:", error)
    return NextResponse.json(
      { 
        error: "Failed to check Redis health",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}