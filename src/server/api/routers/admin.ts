import { getAvailabilityMap } from "@/lib/utils/getAvailabilityMap";
import {
  ApplicantSchema,
  ApplicantsSchema,
  AvailabilityMapSchema,
} from "@/lib/z.schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getAvailabities } from "@/server/db/queries";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  getAvailabities: protectedProcedure
    .output(
      z.object({
        officers: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
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
          fullName: application.fullName,
          email: application.email,
          uin: application.uin,
          altEmail: application.altEmail,
          phone: application.phone,
          year: application.year,
          major: application.major,
          availability: application.availability,
        },
        interests: {
          interestedAnswer: application.interestedAnswer,
          challenges: application.challenges.map((challenge) => {
            return challenge.challenge;
          }),
          interestedChallenge: application.interestedChallenge,
          passionAnswer: application.passionAnswer,
          isLeadership: application.isLeadership,
        },
        leadership: {
          skillsAnswer: application.skillsAnswer,
          conflictsAnswer: application.conflictsAnswer,
          presentation: application.presentation,
          timeManagement: application.timeManagement,
        },
        meetingTimes: application.meetingTimes.map((meetingTime) => {
          return meetingTime.gridTime;
        }),
        resumeLink: application.resumeLink,
      };
    }),
});
