import DriveService from "@/server/service/google-drive";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const resumeId = req.nextUrl.searchParams.get("resumeId");
  const userEmail = req.nextUrl.searchParams.get("userEmail");

  if (!resumeId || !userEmail) {
    return new NextResponse("Invalid search params", { status: 400 });
  }

  const canUserAccess = await DriveService.canUserAccessFile({
    fileId: resumeId,
    email: userEmail,
  });

  if (!canUserAccess) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const resumeFile = await DriveService.getFileData(resumeId);
  return NextResponse.json(resumeFile);
}
