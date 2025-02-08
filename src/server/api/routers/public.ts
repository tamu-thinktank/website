import { ApplyFormSchema } from "@/lib/validations/apply";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import DriveService from "@/server/service/google-drive";
import { z } from "zod";

export const publicRouter = createTRPCRouter({
  applyForm: publicProcedure
    .input(ApplyFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.application.create({
        data: {
          // Personal Info
          ...input.personal,
          
          // Academic Info
          ...input.academic,
          timeCommitment: {
            create: input.academic.timeCommitment.map(tc => ({
              name: tc.name,
              hours: tc.hours,
              type: tc.type,
            })),
          },
          
          // ThinkTank Info
          meetings: input.thinkTankInfo.meetings,
          weeklyCommitment: input.thinkTankInfo.weeklyCommitment,
          preferredTeams: {
            create: input.thinkTankInfo.preferredTeams.map(pt => ({
              interest: pt.interestLevel, // Match Prisma schema field name
              team: {
                connect: { id: pt.teamId }
              }
            })),
          },
          researchAreas: {
            create: input.thinkTankInfo.researchAreas.map(ra => ({
              interest: ra.interestLevel, // Match Prisma schema field name
              researchArea: {
                connect: { id: ra.researchAreaId }
              }
            })),
          },
          referral: {
            set: input.thinkTankInfo.referralSources,
          },
          
          // Open-Ended Questions
          passion: input.openEndedQuestions.passionAnswer,
          teamwork: input.openEndedQuestions.teamworkAnswer,
          
          // Meeting Times
          meetingTimes: {
            createMany: {
              data: input.meetingTimes.map(gridTime => ({ gridTime })),
            },
          },
          
          // Resume fields (directly on Application model)
          resumeId: input.resume.resumeId,
          signatureCommitment: input.resume.signatureCommitment,
          signatureAccountability: input.resume.signatureAccountability,
          signatureQuality: input.resume.signatureQuality
        },
      });
    }),
    
  deleteResume: publicProcedure
    .input(z.object({ resumeId: z.string() }))
    .mutation(async ({ input }) => {
      await DriveService.deleteFile(input.resumeId);
    }),
});
