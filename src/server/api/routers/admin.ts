import { RESUME_ACCEPTED_ID, RESUME_PENDING_ID, RESUME_REJECTED_ID } from "@/consts/google-things"
import { getAvailabilityMap } from "@/lib/utils/availability-grid/getAvailabilityMap"
import { AvailabilityMapSchema } from "@/lib/validations/apply"
import { ApplicantSchema, ApplicantsSchema} from "@/lib/validations/applicants"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { getAllApplications, getAvailabities, getTargetTeams } from "@/server/db/queries"
import sendEmail from "@/server/service/email"
import DriveService from "@/server/service/google-drive"
import { Temporal } from "@js-temporal/polyfill"
import { Challenge } from "@prisma/client"
import InterviewEmail from "emails/interview"
import RejectAppEmail from "emails/reject-app"
import { z } from "zod"

const teamsEnumSchema = z.nativeEnum(Challenge)
const teamsSchema = z.array(teamsEnumSchema)

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
      return await getTargetTeams(ctx.session.user.id)
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
        const teams = await getTargetTeams(ctx.session.user.id, tx)

        if (input.op === "add") {
          if (teams.includes(input.team)) {
            throw new Error("Team already selected")
          }
        } else if (!teams.includes(input.team)) {
          throw new Error("Team not selected")
        }

        await tx.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            targetTeams: input.op === "add" ? { push: input.team } : { set: teams.filter((t) => t !== input.team) },
          },
        })
      })
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
      })

      const dbAvailabilities = await getAvailabities(officers.map((o) => o.id))
      const availabilities = getAvailabilityMap(dbAvailabilities)

      return {
        officers,
        availabilities,
      }
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
      const { gridTimes } = input

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
      })

      return true
    }),
  clearAvailabilities: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.officerTime.deleteMany()
    return true
  }),
  getApplicants: protectedProcedure.output(ApplicantsSchema).query(async ({ ctx }) => {
    const applications = await ctx.db.application.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        submittedAt: true,
        status: true,
      },
    })

    return applications
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
      })

      if (!application) {
        throw new Error("Application not found")
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
          .map((meetingTime) => Temporal.ZonedDateTime.from(meetingTime.gridTime))
          .sort((a, b) => Temporal.ZonedDateTime.compare(a, b))
          .map((meetingTime) => meetingTime.toString()),
        resumeId: application.resumeId,
      }
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
    .mutation(async ({ input: { applicantId, resumeId, status, location }, ctx }) => {
      await ctx.db.application.update({
        where: {
          id: applicantId,
        },
        data: {
          status,
          location,
        },
      })

      try {
        await DriveService.moveFile({
          fromFolderId: RESUME_PENDING_ID,
          toFolderId: status === "ACCEPTED" ? RESUME_ACCEPTED_ID : RESUME_REJECTED_ID,
          fileId: resumeId,
        })
      } catch (e) {
        throw new Error("Failed to move resume: " + (e as Error).message)
      }

      return true
    }),
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
        team: z.string().optional(),
        applicationType: z.string().optional(),
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
          team,
          applicationType,
        },
        ctx,
      }) => {
        try {
          // Parse the startTime string
          const date = new Date(startTime)

          // If you're seeing a 5-hour difference (5pm intended but showing as 10pm),
          // the time is likely being interpreted as UTC when it should be in Central Time

          // Format the time explicitly for Central Time (UTC-5/UTC-6)
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "America/Chicago",
          }

          const formatter = new Intl.DateTimeFormat("en-US", options)
          const formattedTime = formatter.format(date) + " CT"

          // Send the email with the properly formatted time
          await sendEmail({
            to: [applicantEmail],
            subject: "ThinkTank Interview",
            template: InterviewEmail({
              userFirstname: applicantName.split(" ")[0] ?? "",
              time: formattedTime,
              location,
              interviewerName: officerName,
              team,
              applicationType,
            }),
          })

          return true
        } catch (e) {
          throw new Error("Failed to send email: " + (e as Error).message)
        }
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
        })
      } catch (e) {
        throw new Error("Failed to send email: " + (e as Error).message)
      }
    }),
  getAllApplications: protectedProcedure.query(async () => {
    return await getAllApplications()
  }),
})
