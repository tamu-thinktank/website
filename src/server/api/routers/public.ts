import { ApplyFormSchema } from "@/lib/validations/apply";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import DriveService from "@/server/service/google-drive";
import { z } from "zod";

export const publicRouter = createTRPCRouter({
  apply: publicProcedure
    .input(ApplyFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.application.create({
        data: {
          ...input.personal,
          ...input.interests,
          challenges: {
            set: input.interests.challenges,
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
