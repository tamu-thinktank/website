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
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: env.APP_EMAIL,
        to,
        cc,
        subject,
        html: render(template),
      },
      (error, info) => {
        if (error) {
          return reject("Unable to send email");
        }
        const message = `Message delivered to ${info.accepted.toString()}`;
        return resolve(message);
      },
    );
  });
}
