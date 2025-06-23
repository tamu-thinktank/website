import { MiniDCApplyFormSchema } from "@/lib/validations/minidc-apply";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const minidcRouter = createTRPCRouter({
  // Mini DC application procedure
  MiniDCApplyForm: publicProcedure
  .input(MiniDCApplyFormSchema)
  .mutation(async ({ input, ctx }) => {
    await ctx.db.application.create({
      data: {
        // Personal Info
        ...input.personal,
        
        // Academic Info
        ...input.academic,
        currentClasses: input.academic.currentClasses.map(c => c.value),
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
          .map(tc => ({
            name: tc.name,
            hours: tc.hours,
            type: tc.type,
          })),
        },
        summerPlans: "",
        
        // Mini DC specific info
        meetings: true,
        weeklyCommitment: input.academic.weeklyCommitment,
        
        // Open-Ended Questions
        firstQuestion: input.openEndedQuestions.previousApplication,
        secondQuestion: input.openEndedQuestions.goals,
        
        // Resume fields
        resumeId: input.resume.resumeId,
        signatureCommitment: input.resume.signatureCommitment,
        signatureAccountability: input.resume.signatureAccountability,
        signatureQuality: input.resume.signatureQuality,
        applicationType: "MINIDC",
      },
    });
  }),
});