import { eventTimezone } from "@/consts/availability-grid";
import { env } from "@/env";
import { auth as calenderAuth, calendar } from "@googleapis/calendar";
import { type Temporal } from "@js-temporal/polyfill";

/**
 * initialize google calendar client
 */
function getCalendarClient() {
  const auth = new calenderAuth.GoogleAuth({
    credentials: env.GCP_CREDENTIALS,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  return calendar({ version: "v3", auth });
}

/**
 * Add 30 minute event to google calendar from `startTime`, which is converted to CT in this function. Emails are attendees to the event.
 * @returns Link to calendar event
 */
export async function addCalenderEvent({
  startTime,
  emails,
}: {
  startTime: Temporal.ZonedDateTime;
  emails: string[];
}) {
  const calendarClient = getCalendarClient();

  // add event to calendar
  const timeInCT = startTime.withTimeZone(eventTimezone);
  const res = await calendarClient.events.insert({
    calendarId: env.CALENDAR_ID,
    requestBody: {
      summary: "TAMU ThinkTank interview",
      location: "TBD",
      start: {
        dateTime: timeInCT.toString(),
      },
      end: {
        dateTime: timeInCT.add({ minutes: 30 }).toString(),
      },
      attendees: emails.map((email) => ({
        email,
      })),
    },
  });

  return res.data.htmlLink;
}
