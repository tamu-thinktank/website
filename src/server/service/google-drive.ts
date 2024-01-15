import { env } from "@/env";
import { drive, auth as driveAuth } from "@googleapis/drive";
import type { Readable } from "stream";

export default class DriveService {
  static getDriveClient() {
    const auth = new driveAuth.GoogleAuth({
      credentials: env.GCP_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    return drive({ version: "v3", auth });
  }

  static async uploadToFolder({
    folderId,
    filename,
    mimeType,
    file,
  }: {
    folderId: string;
    filename: string;
    mimeType: string;
    file: Readable;
  }) {
    const driveClient = this.getDriveClient();

    const uploadedFile = await driveClient.files.create({
      requestBody: {
        name: filename,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: file,
      },
      fields: "id",
      supportsAllDrives: true,
    });

    const fileId = uploadedFile.data.id;
    return fileId;
  }

  static async moveFile({
    fromFolderId,
    toFolderId,
    fileId,
  }: {
    fromFolderId: string;
    toFolderId: string;
    fileId: string;
  }) {
    const driveClient = this.getDriveClient();

    await driveClient.files.update({
      fileId,
      removeParents: fromFolderId,
      addParents: toFolderId,
      fields: "id",
      supportsAllDrives: true,
    });
  }

  static async getFileData(fileId: string) {
    const driveClient = this.getDriveClient();

    const metadata = await driveClient.files.get({
      fileId,
      supportsAllDrives: true,
      fields: "id, name, webViewLink",
    });

    if (
      !metadata.data.id ||
      !metadata.data.name ||
      !metadata.data.webViewLink
    ) {
      throw new Error("Invalid file metadata");
    }

    const content = await driveClient.files.get(
      {
        fileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "arraybuffer",
      },
    );

    return {
      fileId: metadata.data.id,
      fileName: metadata.data.name,
      fileViewLink: metadata.data.webViewLink,
      // Because of the responseType, content.data is an ArrayBuffer
      fileContent: Buffer.from(content.data as ArrayBuffer),
    };
  }

  static async canUserAccessFile({
    fileId,
    email,
  }: {
    fileId: string;
    email: string;
  }) {
    const driveClient = this.getDriveClient();

    const res = await driveClient.permissions.list({
      fileId,
      supportsAllDrives: true,
      fields: "permissions(id, emailAddress)",
    });

    return (
      res.data.permissions?.some(
        (permission) => permission.emailAddress === email,
      ) ?? false
    );
  }

  static async deleteFile(fileId: string) {
    const driveClient = this.getDriveClient();

    return await driveClient.files.delete({
      fileId,
      supportsAllDrives: true,
    });
  }
}
