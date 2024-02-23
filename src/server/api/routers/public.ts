import { ApplyFormSchema } from "@/lib/validations/apply";
import { JSCFormSchema } from "@/lib/validations/jsc";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import DriveService from "@/server/service/google-drive";
import { z } from "zod";

export const publicRouter = createTRPCRouter({
  apply: publicProcedure
    .input(ApplyFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.application.create({
        data: {
          id: input.id,
          ...input.personal,
          ...input.interests,
          challenges: {
            connectOrCreate: input.interests.challenges.map((challenge) => ({
              where: {
                challenge,
              },
              create: {
                challenge,
              },
            })),
          },
          ...input.leadership,
          meetingTimes: {
            createMany: {
              data: input.meetingTimes.map((gridTime) => ({
                gridTime,
              })),
            },
          },
          resumeId: input.resumeId,
        },
      });
    }),
  deleteResume: publicProcedure
    .input(
      z.object({
        resumeId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await DriveService.deleteFile(input.resumeId);
    }),
});

export const publicJSCRouter = createTRPCRouter({
  jsc: publicProcedure.input(JSCFormSchema).mutation(async ({ input, ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await ctx.db.jsc.create({
      data: {
        id: input.id,
        ...input.personal,
        ...input.interests,
        ...input.leadership,
        resumeId: input.resumeId,
      },
    });
  }),
  deleteResume: publicProcedure
    .input(
      z.object({
        resumeId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await DriveService.deleteFile(input.resumeId);
    }),
});
