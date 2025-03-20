import { ApplyFormSchema, OfficerApplyFormSchema } from "@/lib/validations/apply";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import DriveService from "@/server/service/google-drive";
import { z } from "zod";

export const publicRouter = createTRPCRouter({
  // Existing DC Member application procedure
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
          preferredTeams: {
            create: input.thinkTankInfo.preferredTeams.map(pt => ({
              interest: pt.interestLevel,
              team: {
                connect: { id: pt.teamId },
              },
            })),
          },
          researchAreas: {
            create: input.thinkTankInfo.researchAreas.map(ra => ({
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
              data: input.meetingTimes.map(gridTime => ({ gridTime })),
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

  // New Officer application procedure
  applyOfficer: publicProcedure
    .input(OfficerApplyFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.application.create({
        data: {
          // Personal Info (shared structure)
          ...input.personal,
          
          // Academic Info (includes officer-specific fields)
          ...input.academic,
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
          
          // ThinkTank Info
          // Note: Officers use officerCommitment instead of meetings/weeklyCommitment
          meetings: true,
          weeklyCommitment: true,
          officerCommitment: input.thinkTankInfo.officerCommitment,
          preferredPositions: {
            create: input.thinkTankInfo.preferredPositions.map(pp => ({
              interest: pp.interestLevel, // Matches the Prisma field name expected in PositionPreference
              position: pp.position,
            })),
          },
          
          // Open-Ended Questions
          firstQuestion: input.openEndedQuestions.firstQuestion,
          secondQuestion: input.openEndedQuestions.secondQuestion,
          
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
          
          // Set application type to officer
          applicationType: "OFFICER",
        },
      });
    }),

  deleteResume: publicProcedure
    .input(z.object({ resumeId: z.string() }))
    .mutation(async ({ input }) => {
      await DriveService.deleteFile(input.resumeId);
    }),
});