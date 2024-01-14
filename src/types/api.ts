import type DriveService from "@/server/service/google-drive";

export interface UploadResumeResponse {
  resumeId: string;
}

export type FileDataResponse = ReturnType<typeof DriveService.getFileData>;
