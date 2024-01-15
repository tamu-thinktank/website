import { eventTimezone } from "@/consts/availability-grid";
import {
  RESUME_ACCEPTED_ID,
  RESUME_PENDING_ID,
  RESUME_REJECTED_ID,
} from "@/consts/google-things";
import { getAvailabilityMap } from "@/lib/utils/availability-grid/getAvailabilityMap";
import {
  ApplicantSchema,
  ApplicantsSchema,
  AvailabilityMapSchema,
} from "@/lib/validations/apply";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getAvailabities } from "@/server/db/queries";
import sendEmail from "@/server/service/email";
import CalendarService from "@/server/service/google-calendar";
import DriveService from "@/server/service/google-drive";
import { Temporal } from "@js-temporal/polyfill";
import InterviewEmail from "emails/interview";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  getAvailabilities: protectedProcedure
    .output(
      z.object({
        officers: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
        /**
         * Map of gridTimes from db to officers (sorted by `selectedAt` in descending order) available at that time
         */
        availabilities: AvailabilityMapSchema,
      }),
    )
    .query(async ({ ctx }) => {
      const officers = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const dbAvailabilities = await getAvailabities();
      const availabilities = getAvailabilityMap(dbAvailabilities);

      return {
        officers,
        availabilities,
      };
    }),
  updateAvailabilities: protectedProcedure
    .input(
      z.intersection(
        z.object({
          gridTimes: z.array(z.string()),
        }),
        z.union([
          z.object({
            mode: z.literal("add"),
            selectedAt: z.string(),
          }),
          z.object({
            mode: z.literal("remove"),
          }),
        ]),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const { gridTimes, mode } = input;

      if (mode === "add") {
        const addOperations = gridTimes.map((gridTime) => {
          return ctx.db.officerTime.upsert({
            where: {
              gridTime_officerId: {
                gridTime,
                officerId: ctx.session.user.id,
              },
            },
            update: {
              selectedAt: input.selectedAt,
            },
            create: {
              gridTime,
              officerId: ctx.session.user.id,
              selectedAt: input.selectedAt,
            },
          });
        });
        await ctx.db.$transaction(addOperations);
      } else if (mode === "remove") {
        await ctx.db.officerTime.deleteMany({
          where: {
            officerId: ctx.session.user.id,
            gridTime: {
              in: gridTimes,
            },
          },
        });
      }

      return true;
    }),
  getApplicants: protectedProcedure
    .output(ApplicantsSchema)
    .query(async ({ ctx }) => {
      const applications = await ctx.db.application.findMany({
        select: {
          id: true,
          fullName: true,
          email: true,
          submittedAt: true,
          status: true,
        },
      });

      return applications;
    }),
  getApplicant: protectedProcedure
    .input(z.string().cuid2())
    .output(ApplicantSchema)
    .query(async ({ input, ctx }) => {
      const application = await ctx.db.application.findUnique({
        where: {
          id: input,
        },
        include: {
          challenges: true,
          meetingTimes: true,
        },
      });

      if (!application) {
        throw new Error("Application not found");
      }

      return {
        ...application,
        personal: {
          ...application,
        },
        interests: {
          ...application,
          interestedAnswer: application.interestedAnswer,
          challenges: application.challenges.map((challenge) => {
            return challenge.challenge;
          }),
        },
        leadership: {
          ...application,
        },
        meetingTimes: application.meetingTimes
          .map((meetingTime) =>
            Temporal.ZonedDateTime.from(meetingTime.gridTime),
          )
          .sort((a, b) => Temporal.ZonedDateTime.compare(a, b))
          .map((meetingTime) => meetingTime.toString()),
        resumeId: application.resumeId,
      };
    }),
  updateApplicant: protectedProcedure
    .input(
      z.object({
        applicantId: z.string().cuid2(),
        resumeId: z.string(),
        status: z.enum(["ACCEPTED", "REJECTED"]),
        location: z.string().optional(),
      }),
    )
    .mutation(
      async ({ input: { applicantId, resumeId, status, location }, ctx }) => {
        await ctx.db.application.update({
          where: {
            id: applicantId,
          },
          data: {
            status,
            location,
          },
        });

        try {
          await DriveService.moveFile({
            fromFolderId: RESUME_PENDING_ID,
            toFolderId:
              status === "ACCEPTED" ? RESUME_ACCEPTED_ID : RESUME_REJECTED_ID,
            fileId: resumeId,
          });
        } catch (e) {
          throw new Error("Failed to move resume: " + (e as Error).message);
        }

        return true;
      },
    ),
  scheduleInterview: protectedProcedure
    .input(
      z.object({
        officerId: z.string().cuid2(),
        officerName: z.string(),
        officerEmail: z.string().email(),
        applicantName: z.string(),
        applicantEmail: z.string().email(),
        startTime: z.string(),
        location: z.string(),
      }),
    )
    .mutation(
      async ({
        input: {
          officerId,
          officerName,
          officerEmail,
          applicantName,
          applicantEmail,
          startTime,
          location,
        },
        ctx,
      }) => {
        const startTimeObj = Temporal.ZonedDateTime.from(startTime);

        // testing calendar api
        // try {
        //   await CalendarService.listEvents(Temporal.Now.zonedDateTimeISO());
        // } catch (e) {
        //   console.log(JSON.stringify(e, null, 2));
        //   throw new Error("Failed to list events: " + (e as Error).message);
        // }

        // add meeting time to google calendar
        let eventLink: Awaited<
          ReturnType<(typeof CalendarService)["addCalenderEvent"]>
        >;
        try {
          eventLink = await CalendarService.addCalenderEvent({
            startTime: startTimeObj,
            location,
            emails: [officerEmail, applicantEmail],
            intervieweeName: applicantName,
            interviewerName: officerName,
          });
        } catch (e) {
          throw new Error(
            "Failed to add event to calendar: " + (e as Error).message,
          );
        }

        // remove meeting time from soonestOfficer's availabilities
        const thirty = Array(2)
          .fill(0)
          .map((_, i) => i * 15)
          .map((minutes) => {
            return startTimeObj.add({ minutes }).toString();
          });
        await ctx.db.officerTime.deleteMany({
          where: {
            officerId,
            gridTime: {
              in: thirty,
            },
          },
        });

        // send email to interview attendees
        try {
          await sendEmail({
            to: [applicantEmail],
            cc: [officerEmail],
            subject: "Interview for Spot on Design Challenge Team",
            template: InterviewEmail({
              userFirstname: applicantName.split(" ")[0] ?? "",
              time: startTimeObj
                .withTimeZone(eventTimezone)
                .toLocaleString("en-US", {
                  dateStyle: "short",
                  timeStyle: "short",
                }),
              location,
              eventLink: eventLink ?? "",
            }),
          });
        } catch (e) {
          throw new Error("Failed to send email: " + (e as Error).message);
        }

        return true;
      },
    ),
});
