import type { ResumeUploadResponse } from "@/consts/types";
import { env } from "@/env";
import { uploadToFolder } from "@/server/service/gcp";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("resume") as unknown as File;

  if (!file) {
    return new NextResponse("No resume uploaded", { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const resumeLink = await uploadToFolder({
    folderId: env.RESUME_PENDING_ID,
    filename: file.name,
    mimeType: file.type,
    file: buffer,
  });

  if (!resumeLink) {
    return new NextResponse("Error uploading resume. Try again later.", {
      status: 500,
    });
  }

  return NextResponse.json({
    resumeLink,
  } satisfies ResumeUploadResponse);
}
