import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import DriveService from "@/server/service/google-drive";
import { ApplyFormSchema, MiniDCApplyFormSchema } from "@/lib/validations/apply";
import { OfficerApplyFormSchema } from "@/lib/validations/officer-apply";
import { MATEROVApplyFormSchema } from "@/lib/validations/materov-apply";
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
          currentClasses: input.academic.currentClasses,
          nextClasses: input.academic.nextClasses,
          timeCommitment: {
            create: input.academic.timeCommitment
              ?.filter((tc): tc is Required<typeof tc> => {
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
              })) ?? [],
          },
          summerPlans: "",

          // ThinkTank Info
          meetings: input.thinkTankInfo.meetings,
          weeklyCommitment: input.thinkTankInfo.weeklyCommitment,
          preferredTeams: {
            create: input.thinkTankInfo.preferredTeams.map((pt) => ({
              teamId: pt.teamId,
              interest: "HIGH", // Default interest level, would need to be part of input
            })),
          },
          researchAreas: {
            create: input.thinkTankInfo.researchAreas?.map((ra) => ({
              researchAreaId: ra.researchAreaId,
              interest: ra.interestLevel,
            })) ?? [],
          },
          referral: input.thinkTankInfo.referralSources,

          // Open-Ended Questions
          firstQuestion: input.openEndedQuestions.firstQuestion,
          secondQuestion: input.openEndedQuestions.secondQuestion,

          // Meeting Times
          meetingTimes: {
            create: input.meetingTimes.map((mt) => ({
              gridTime: mt,
            })),
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

  applyMiniDC: publicProcedure
    .input(MiniDCApplyFormSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.application.create({
        data: {
          // Personal Info
          ...input.personal,

          // Academic Info
          ...input.academic,
          currentClasses: input.academic.currentClasses,
          timeCommitment: {
            create: input.academic.timeCommitment
              ?.filter((tc): tc is Required<typeof tc> => {
                return (
                  typeof tc.name === "string" &&
                  typeof tc.hours === "number" &&
                  tc.name.trim().length > 0 &&
                  tc.hours >= 0
                );
              })
              .map((tc) => ({
                name: tc.name,
                hours: tc.hours,
                type: tc.type,
              })) ?? [],
          },
          summerPlans: "",
          nextClasses: [],

          // Mini DC specific info
          meetings: true,
          weeklyCommitment: input.academic.weeklyCommitment,
          preferredTeams: { create: [] },
          researchAreas: { create: [] },
          referral: [],

          // Open-Ended Questions
          firstQuestion: input.openEndedQuestions.previousApplication,
          secondQuestion: input.openEndedQuestions.goals,

          // Meeting Times (minidc doesn't have meeting times)
          meetingTimes: { create: [] },

          // Resume fields
          resumeId: input.resume.resumeId,
          signatureCommitment: input.resume.signatureCommitment,
          signatureAccountability: input.resume.signatureAccountability,
          signatureQuality: input.resume.signatureQuality,
          applicationType: "MINIDC",
        },
      });
    }),

  applyOfficer: publicProcedure
    .input(OfficerApplyFormSchema)
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
              ?.filter((tc): tc is Required<typeof tc> => {
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
              })) ?? [],
          },
          summerPlans: input.academic.summerPlans,

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
          preferredTeams: { create: [] },
          researchAreas: { create: [] },
          referral: [],

          // Open-Ended Questions
          firstQuestion: input.openEndedQuestions.firstQuestion,
          secondQuestion: input.openEndedQuestions.secondQuestion,

          // Meeting Times
          meetingTimes: {
            create: input.meetingTimes.map((mt) => ({
              gridTime: mt,
            })),
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

  applyMateROV: publicProcedure
    .input(MATEROVApplyFormSchema)
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
              ?.filter((tc): tc is Required<typeof tc> => {
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
              })) ?? [],
          },
          summerPlans: "",

          // ThinkTank Info  
          meetings: input.thinkTankInfo.meetings,
          weeklyCommitment: input.thinkTankInfo.weeklyCommitment,
          subteamPreferences: {
            create: input.thinkTankInfo.subteamPreferences.map((sp) => ({
              name: sp.name,
              interest: sp.interest,
            })),
          },
          skills: {
            create: input.thinkTankInfo.skills.map((skill) => ({
              name: skill.name,
              experienceLevel: skill.experienceLevel,
            })),
          },
          learningInterests: {
            create: input.thinkTankInfo.learningInterests.map((li) => ({
              area: li.area,
              interestLevel: li.interestLevel,
            })),
          },
          previousParticipation: input.thinkTankInfo.previousParticipation,
          preferredTeams: { create: [] },
          researchAreas: { create: [] },
          referral: input.thinkTankInfo.referralSources,

          // Open-Ended Questions
          firstQuestion: input.openEndedQuestions.firstQuestion,
          secondQuestion: input.openEndedQuestions.secondQuestion,
          thirdQuestion: input.openEndedQuestions.thirdQuestion,

          // Meeting Times
          meetingTimes: {
            create: input.meetingTimes.map((mt) => ({
              gridTime: mt,
            })),
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

  deleteResume: publicProcedure
    .input(z.object({ resumeId: z.string() }))
    .mutation(async ({ input }) => {
      await DriveService.deleteFile(input.resumeId);
    }),
});
