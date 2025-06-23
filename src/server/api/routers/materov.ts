import { MATEROVApplyFormSchema } from "@/lib/validations/materov-apply";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const mateROVRouter = createTRPCRouter({
  // MATE ROV application procedure
  MateROVApplyForm: publicProcedure
  .input(MATEROVApplyFormSchema)
  .mutation(async ({ input, ctx }) => {
    await ctx.db.application.create({
      data: {
        // Personal Info
        ...input.personal,
        
        // Academic Info
        ...input.academic,
        currentClasses: input.academic.currentClasses.map(c => c.value),
        nextClasses: input.academic.nextClasses.map(c => c.value),
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
        
        // ThinkTank Info
        meetings: input.thinkTankInfo.meetings,
        weeklyCommitment: input.thinkTankInfo.weeklyCommitment,
        previousParticipation: input.thinkTankInfo.previousParticipation,
        referral: {
          set: input.thinkTankInfo.referralSources,
        },
        
        // MATE ROV specific fields
        subteamPreferences: {
          create: input.thinkTankInfo.subteamPreferences.map(st => ({
            name: st.name,
            interest: st.interest,
          })),
        },
        skills: {
          create: input.thinkTankInfo.skills.map(skill => ({
            name: skill.name,
            experienceLevel: skill.experienceLevel,
          })),
        },
        learningInterests: {
          create: input.thinkTankInfo.learningInterests.map(interest => ({
            area: interest.area,
            interestLevel: interest.interestLevel,
          })),
        },
        
        // Open-Ended Questions
        firstQuestion: input.openEndedQuestions.firstQuestion,
        secondQuestion: input.openEndedQuestions.secondQuestion,
        thirdQuestion: input.openEndedQuestions.thirdQuestion,
        
        // Meeting Times
        meetingTimes: {
          createMany: {
            data: input.meetingTimes.map(gridTime => ({ gridTime })),
          },
        },
        
        // Resume fields
        resumeId: input.resume.resumeId,
        signatureCommitment: input.resume.signatureCommitment,
        signatureAccountability: input.resume.signatureAccountability,
        signatureQuality: input.resume.signatureQuality,
        applicationType: "MATEROV",
      },
    });
  }),
});