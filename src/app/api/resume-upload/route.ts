// // pages/api/upload.js
// import { type drive_v3 } from "@googleapis/drive";
// import { type NextRequest, type NextResponse } from "next/server";

// export default async function handler(req: NextRequest, res: NextResponse) {
//   const formData = await req.formData();
//   const file = formData.get("file");

//   if (!file) {
//     return res.status;
//   }

//   // Authenticate with Google
//   const auth = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URL,
//   );
//   auth.setCredentials({ access_token: process.env.GOOGLE_ACCESS_TOKEN });

//   // Upload the file to Google Drive
//   const drive = google.drive({ version: "v3", auth });
//   const driveResponse = await (drive as drive_v3.Drive).files.create({
//     requestBody: {
//       name: file.name,
//       mimeType: file.type,
//     },
//     media: {
//       mimeType: file.type,
//       body: file.stream(), // Convert the file to a stream
//     },
//   });

//   // Construct a shareable link
//   const fileId = driveResponse.data.id;
//   const link = `https://drive.google.com/uc?export=view&id=${fileId}`;

//   // Save the link to your MySQL database
//   // ...

//   res.status(200).send("File uploaded");
// }
