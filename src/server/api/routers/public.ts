import { ApplyFormSchema } from "@/lib/z.schema";
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
            connectOrCreate: input.interests.challenges.map((challenge) => {
              return {
                where: {
                  challenge,
                },
                create: {
                  challenge,
                },
              };
            }),
          },
          ...input.leadership,
          resumeId: input.resumeId,
          meetingTimes: {
            createMany: {
              data: input.meetingTimes.map((gridTime) => ({
                gridTime,
              })),
            },
          },
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
