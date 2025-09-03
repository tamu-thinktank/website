import { env } from "@/env";
import { render } from "@react-email/render";
import { createTransport } from "nodemailer";
import type { ReactElement } from "react";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: env.APP_EMAIL,
    pass: env.APP_PW,
  },
});
export default async function sendEmail({
  to,
  cc,
  subject,
  template,
}: {
  to: string[];
  cc?: string[];
  subject: string;
  template: ReactElement;
}) {
  console.log(`📧 [EMAIL-SERVICE] Attempting to send email:`);
  console.log(`📧 [EMAIL-SERVICE] From: ${env.APP_EMAIL}`);
  console.log(`📧 [EMAIL-SERVICE] To: ${to.join(", ")}`);
  console.log(`📧 [EMAIL-SERVICE] Subject: ${subject}`);
  console.log(`📧 [EMAIL-SERVICE] CC: ${cc?.join(", ") ?? "None"}`);

  return new Promise((resolve, reject) => {
    try {
      const htmlContent = render(template);
      console.log(
        `📧 [EMAIL-SERVICE] Template rendered successfully (${htmlContent.length} chars)`,
      );

      transporter.sendMail(
        {
          from: `"ThinkTank" <${env.APP_EMAIL}>`,
          to,
          cc,
          subject,
          html: htmlContent,
        },
        (error, info) => {
          if (error) {
            console.error(`❌ [EMAIL-SERVICE] Failed to send email:`, error);
            return reject(`Unable to send email: ${error.message}`);
          }

          console.log(`✅ [EMAIL-SERVICE] Email sent successfully!`);
          console.log(`📧 [EMAIL-SERVICE] Message ID: ${info.messageId}`);
          console.log(
            `📧 [EMAIL-SERVICE] Accepted: ${info.accepted.toString()}`,
          );
          console.log(
            `📧 [EMAIL-SERVICE] Rejected: ${info.rejected.toString()}`,
          );
          console.log(`📧 [EMAIL-SERVICE] Response: ${info.response}`);

          const message = `Message delivered to ${info.accepted.toString()}`;
          return resolve(message);
        },
      );
    } catch (renderError) {
      console.error(
        `❌ [EMAIL-SERVICE] Failed to render template:`,
        renderError,
      );
      reject(
        `Failed to render email template: ${renderError instanceof Error ? renderError.message : "Unknown error"}`,
      );
    }
  });
}
