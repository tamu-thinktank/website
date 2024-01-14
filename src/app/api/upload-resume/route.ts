import { RESUME_PENDING_ID } from "@/consts/google-things";
import DriveService from "@/server/service/google-drive";
import { NextResponse, type NextRequest } from "next/server";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("resume") as unknown as File;

  if (!file) {
    return new NextResponse("No resume uploaded", { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const stream = Readable.from(buffer);

  const resumeId = await DriveService.uploadToFolder({
    folderId: RESUME_PENDING_ID,
    filename: file.name,
    mimeType: file.type,
    file: stream,
  });

  if (!resumeId) {
    return new NextResponse("Error uploading resume. Try again later.", {
      status: 500,
    });
  }

  return NextResponse.json({
    resumeId,
  });
}
