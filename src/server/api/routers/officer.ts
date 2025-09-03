import { OfficerApplyFormSchema } from "@/lib/validations/officer-apply";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const officerRouter = createTRPCRouter({
  // Officer application procedure
  OfficerApplyForm: publicProcedure
    .input(OfficerApplyFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.application.create({
        data: {
          // Personal Info
          ...input.personal,

          // Academic Info
          ...input.academic,
          currentClasses: input.academic.currentClasses.map((c) => c.value),
          nextClasses: input.academic.nextClasses.map((c) => c.value),
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

          // ThinkTank Info
          meetings: true,
          weeklyCommitment: true,
          officerCommitment: input.thinkTankInfo.officerCommitment,
          preferredPositions: {
            create: input.thinkTankInfo.preferredPositions.map((pp) => ({
              interest: pp.interestLevel,
              position: pp.position,
            })),
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
          applicationType: "OFFICER",
        },
      });
    }),
});
