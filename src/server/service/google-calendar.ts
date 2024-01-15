import { eventTimezone } from "@/consts/availability-grid";
import { CALENDAR_ID } from "@/consts/google-things";
import { env } from "@/env";
import { getServerAuthSession } from "@/lib/auth";
import { getBaseUrl } from "@/lib/trpc/shared";
import {
  Auth0MgmtAccessTokenSchema,
  Auth0UserIdentitiesSchema,
} from "@/lib/validations/auth";
import { calendar, auth as calenderAuth } from "@googleapis/calendar";
import { type Temporal } from "@js-temporal/polyfill";
import axios from "axios";

export default class CalendarService {
  /**
   * @deprecated b/c we can't do Domain-Wide Delegation of Authority with a service account on personal gmail accounts
   */
  static async getCalendarClient() {
    const auth = new calenderAuth.GoogleAuth({
      credentials: env.GCP_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });

    return calendar({ version: "v3", auth });
  }

  /**
   * @see https://auth0.com/docs/secure/tokens/access-tokens/get-management-api-access-tokens-for-production
   */
  static async getAuth0MgmtAccessToken() {
    const config = {
      method: "POST",
      url: `${env.AUTH0_ISSUER}/oauth/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        grant_type: "client_credentials",
        client_id: env.AUTH0_CLIENT_ID,
        client_secret: env.AUTH0_CLIENT_SECRET,
        audience: `${env.AUTH0_ISSUER}/api/v2/`,
      },
    };

    const res = Auth0MgmtAccessTokenSchema.parse(
      (await axios.request(config)).data,
    );

    return res.access_token;
  }

  /**
   * @see https://auth0.com/docs/api/management/v2/users/get-users-by-id
   */
  static async getUserIdpRefreshToken() {
    const mgmtAccessToken = await this.getAuth0MgmtAccessToken();
    const session = await getServerAuthSession();
    const userId = session?.user.providerAccountId;
    if (!userId) {
      throw new Error("User not logged in");
    }

    const config = {
      method: "GET",
      maxBodyLength: Infinity,
      url: `${env.AUTH0_ISSUER}/api/v2/users/${userId}`,
      headers: {
        Accept: "application/json",
        authorization: `Bearer ${mgmtAccessToken}`,
      },
    };

    const user = Auth0UserIdentitiesSchema.parse(
      (await axios.request(config)).data,
    );

    return user.identities[0]!.refresh_token;
  }

  static async getCalendarOAuthClient() {
    const refreshToken = await this.getUserIdpRefreshToken();
    const auth = new calenderAuth.OAuth2({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: getBaseUrl() + "/api/auth/callback/auth0",
    });
    auth.setCredentials({
      refresh_token: refreshToken,
    });

    return calendar({ version: "v3", auth });
  }

  /**
   * Add 30 minute event to google calendar from `startTime`, which is converted to CT in this function. Emails are attendees to the event.
   * @param startTime
   * @param emails Emails of attendees
   * @returns Link to calendar event
   */
  static async addCalenderEvent({
    startTime,
    emails,
  }: {
    startTime: Temporal.ZonedDateTime;
    emails: string[];
  }) {
    const calendarClient = await this.getCalendarOAuthClient();
    const timeInCT = startTime.withTimeZone(eventTimezone);
    const res = await calendarClient.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        organizer: {
          email: env.APP_EMAIL,
        },
        summary: "ThinkTank Interview",
        location: "TBD",
        start: {
          dateTime: timeInCT.toString({
            timeZoneName: "never",
          }),
        },
        end: {
          dateTime: timeInCT.add({ minutes: 30 }).toString({
            timeZoneName: "never",
          }),
        },
        attendees: emails.map((email) => ({
          email,
        })),
      },
    });

    const eventLink = res.data.htmlLink;
    if (!eventLink) {
      throw new Error("Error retrieving event link");
    }

    return eventLink;
  }

  /**
   * Lists the next 10 events on the calendar. Used for testing.
   */
  static async listEvents(time: Temporal.ZonedDateTime) {
    const calendarClient = await this.getCalendarOAuthClient();
    const res = await calendarClient.events.list({
      calendarId: CALENDAR_ID,
      timeMin: time.toString({
        timeZoneName: "never",
      }),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log("No upcoming events found.");
      return;
    }

    console.log("Upcoming 10 events:");
    events.map((event) => {
      const start = event.start?.dateTime ?? event.start?.date;
      console.log(`${start} - ${event.summary}`);
    });
  }
}
