import DriveService from "@/server/service/google-drive";
import { redis, CacheTTL } from "@/lib/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const resumeId = req.nextUrl.searchParams.get("resumeId");
  const userEmail = req.nextUrl.searchParams.get("userEmail");

  if (!resumeId || !userEmail) {
    return new NextResponse("Invalid search params", { status: 400 });
  }

  // Try to get cached resume data first
  const cacheKey = `resume:${resumeId}:${userEmail}`;
  try {
    const cachedResume = await redis.get(cacheKey);
    if (cachedResume) {
      return NextResponse.json(cachedResume);
    }
  } catch (error) {
    // If cache fails, continue with normal flow
    console.warn("Resume cache lookup failed:", error);
  }

  const canUserAccess = await DriveService.canUserAccessFile({
    fileId: resumeId,
    email: userEmail,
  });

  if (!canUserAccess) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const resumeFile = await DriveService.getFileData(resumeId);

  // Cache the resume data for future requests (15 minutes TTL)
  try {
    await redis.set(cacheKey, resumeFile, { ex: CacheTTL.MEDIUM });
  } catch (error) {
    // If caching fails, continue with response
    console.warn("Resume cache write failed:", error);
  }

  return NextResponse.json(resumeFile);
}
