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
import {
  getAllApplications,
  getAvailabities,
  getTargetTeams,
} from "@/server/db/queries";
import sendEmail from "@/server/service/email";
import CalendarService from "@/server/service/google-calendar";
import DriveService from "@/server/service/google-drive";
import { Temporal } from "@js-temporal/polyfill";
import { Challenge } from "@prisma/client";
import InterviewEmail from "emails/interview";
import RejectAppEmail from "emails/reject-app";
import { z } from "zod";

const teamsEnumSchema = z.nativeEnum(Challenge);
const teamsSchema = z.array(teamsEnumSchema);

export const adminRouter = createTRPCRouter({
  getTargetTeams: protectedProcedure
    .input(
      z
        .object({
          officerId: z.string().cuid2(),
        })
        .optional(),
    )
    .output(teamsSchema)
    .query(async ({ ctx }) => {
      return await getTargetTeams(ctx.session.user.id);
    }),
  updateTargetTeams: protectedProcedure
    .input(
      z.object({
        team: teamsEnumSchema,
        op: z.enum(["add", "remove"]).default("add"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.$transaction(async (tx) => {
        const teams = await getTargetTeams(ctx.session.user.id, tx);

        if (input.op === "add") {
          if (teams.includes(input.team)) {
            throw new Error("Team already selected");
          }
        } else if (!teams.includes(input.team)) {
          throw new Error("Team not selected");
        }

        await tx.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            targetTeams:
              input.op === "add"
                ? { push: input.team }
                : { set: teams.filter((t) => t !== input.team) },
          },
        });
      });
    }),

  getAvailabilities: protectedProcedure
    .input(
      z
        .object({
          targetTeam: teamsEnumSchema,
        })
        .optional(),
    )
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
    .query(async ({ ctx, input }) => {
      const officers = await ctx.db.user.findMany({
        where: input?.targetTeam
          ? {
              targetTeams: {
                has: input.targetTeam,
              },
            }
          : undefined,
        select: {
          id: true,
          name: true,
        },
      });

      const dbAvailabilities = await getAvailabities(officers.map((o) => o.id));
      const availabilities = getAvailabilityMap(dbAvailabilities);

      return {
        officers,
        availabilities,
      };
    }),
  setAvailabilities: protectedProcedure
    .input(
      z.object({
        gridTimes: z.array(
          z.object({
            gridTime: z.string(),
            selectedAt: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { gridTimes } = input;

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          availability: {
            deleteMany: {}, // delete all existing times
            create: gridTimes, // create new times
          },
        },
      });

      return true;
    }),
  clearAvailabilities: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.officerTime.deleteMany();
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
        team: z.string().optional(),
        applicationType: z.string().optional(),
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
            subject: "ThinkTank Interview",
            template: InterviewEmail({
              userFirstname: applicantName.split(" ")[0] ?? "",
              time: startTimeObj
                .withTimeZone(eventTimezone)
                .toLocaleString("en-US", {
                  dateStyle: "short",
                  timeStyle: "short",
                }),
              location,
              eventLink: eventLink,
              interviewerName: officerName,
            }),
          });
        } catch (e) {
          throw new Error("Failed to send email: " + (e as Error).message);
        }

        return true;
      },
    ),
  rejectAppEmail: protectedProcedure
    .input(
      z.object({
        applicantName: z.string(),
        applicantEmail: z.string().email(),
      }),
    )
    .mutation(async ({ input: { applicantName, applicantEmail } }) => {
      try {
        await sendEmail({
          to: [applicantEmail],
          subject: "ThinkTank Application Status",
          template: RejectAppEmail({
            userFirstname: applicantName.split(" ")[0] ?? "",
          }),
        });
      } catch (e) {
        throw new Error("Failed to send email: " + (e as Error).message);
      }
    }),
  getAllApplications: protectedProcedure.query(async () => {
    return await getAllApplications();
  }),
});
