# Libraries

## emails

- Only emails in `ALLOWED_EMAILS` in `.env` can sign in
- Emails need to be added to OAuth2 consent screen in Google Cloud Console
- Make sure all emails have access to shared drive and calendar

### react-email

- need packages: `react-email`, `@react-email/components`, `@react-email/render`
- templates in `/emails` folder, use `pnpm email` to see templates in browser
- for static files, copy to `/public` folder to the one in the `.react-email` folder

### nodemailer with gmail

- <https://javascript.plainenglish.io/sending-emails-with-nodemailer-in-next-js-ccada06abfc9>

## gcp

### @googleapis/drive

- using service account key file json as a base64 string in .env

### @googleapis/calendar

- using Google OAuth2 w/ Auth0 Management API to get refresh token for calendar API
  - Auth0 params in nextauth options
