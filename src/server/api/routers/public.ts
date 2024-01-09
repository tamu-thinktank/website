import { ApplyFormSchema } from "@/lib/z.schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
          resumeLink: input.resumeLink,
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
});
