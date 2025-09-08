import { DCMemberApplyFormSchema } from "@/lib/validations/dcmember-apply";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const dcmemberRouter = createTRPCRouter({
  // DC Member application procedure
  DCMemberApplyForm: publicProcedure
    .input(DCMemberApplyFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.application.create({
        data: {
          // Personal Info
          ...input.personal,

          // Academic Info
          ...input.academic,
          currentClasses: input.academic.currentClasses,
          nextClasses: input.academic.nextClasses,
          timeCommitment: {
            create: input.academic.timeCommitment
              .filter((tc): tc is Required<typeof tc> => {
                return (
                  typeof tc.name === "string" &&
                  typeof tc.hours === "number" &&
                  tc.name.trim().length > 0 &&
                  tc.hours > 0
                );
              })
              .map((tc) => ({
                name: tc.name,
                hours: tc.hours,
                type: tc.type,
              })),
          },
          summerPlans: "",

          // ThinkTank Info
          meetings: input.thinkTankInfo.meetings,
          weeklyCommitment: input.thinkTankInfo.weeklyCommitment,
          preferredTeams: {
            create: input.thinkTankInfo.preferredTeams.map((pt) => ({
              interest: pt.interestLevel,
              team: {
                connect: { id: pt.teamId },
              },
            })),
          },
          researchAreas: {
            create: input.thinkTankInfo.researchAreas.map((ra) => ({
              interest: ra.interestLevel,
              researchArea: {
                connect: { id: ra.researchAreaId },
              },
            })),
          },
          referral: {
            set: input.thinkTankInfo.referralSources,
          },

          // Open-Ended Questions
          firstQuestion: input.openEndedQuestions.firstQuestion,
          secondQuestion: input.openEndedQuestions.secondQuestion,

          // Meeting Times
          meetingTimes: {
            createMany: {
              data: input.meetingTimes.map((gridTime) => ({ gridTime })),
            },
          },

          // Resume fields
          resumeId: input.resume.resumeId,
          signatureCommitment: input.resume.signatureCommitment,
          signatureAccountability: input.resume.signatureAccountability,
          signatureQuality: input.resume.signatureQuality,
          applicationType: "DCMEMBER",
        },
      });
    }),
});
