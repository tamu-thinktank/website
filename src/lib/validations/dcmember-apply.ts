import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { ReferralSource, InterestLevel } from "@prisma/client";
import { TEAMS } from "@/consts/apply-form";
import { yearSchema, majorSchema, classSchema, PRESET_PRONOUNS, PRESET_GENDERS, wordCount, validateSignature } from "./apply";

export const DCMemberApplyFormSchema = z.object({
  // Personal info section
  personal: z.object({
    fullName: z.string().min(1, "Full Name is required").max(100, "Name too long"),
    preferredName: z.string().nullable(),
    pronouns: z.string()
      .refine(val => 
        PRESET_PRONOUNS.includes(val) || 
        (val.startsWith("OTHER:") && val.length > 7) || 
        !val, // allows empty value
        "Invalid or incomplete pronouns"
      )
      .optional(), // makes field optional

    gender: z.string()
      .refine(val => 
        PRESET_GENDERS.includes(val) || 
        (val.startsWith("OTHER:") && val.length > 7) || 
        !val, // allows empty value
        "Invalid or incomplete gender"
      )
  .optional(), // makes field optional
    uin: z.coerce
      .number({
        invalid_type_error: "Expected a number",
      })
      .refine((n) => /^\d{3}00\d{4}$/.test(n.toString()), {
        message: "Invalid UIN",
      }),
    email: z
      .string()
      .email("Invalid email")
      .regex(/@tamu.edu$/, "Must end with @tamu.edu"),
    altEmail: z
      .string()
      .nullable()
      .refine(
        (input) => {
          // email check here to allow empty string
          if (input?.length) {
            return z.string().email().safeParse(input).success;
          }

          return true;
        },
        {
          message: "Invalid email",
        },
      ),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number"),
  }),

  // Academic Information Section
  academic: z.object({
    year: yearSchema,
    major: majorSchema,
    currentClasses: z
      .array(classSchema)
      .min(2, "Enter at least two classes"),
    nextClasses: z
      .array(classSchema)
      .min(2, "Enter at least two classes"),
    timeCommitment: z
      .array(
        z.object({
          name: z.string().min(1, "Name is required"),
          hours: z.number()
            .min(1, "Minimum 1 hour required")
            .max(15, "Cannot exceed 15 hours"),
          type: z.enum(["CURRENT", "PLANNED"])
        })
      )
      .optional()
      .default([]) 
      .refine(
        (commitments) => {
          const seen = new Set<string>();
          for (const commitment of commitments) {
            const key = `${commitment.name.trim().toLowerCase()}-${commitment.type}`;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
          }
          return true;
        },
        {
          message: "Commitment names must be unique",
        }
      )
  }),

  // ThinkTank Information Section
  thinkTankInfo: z.object({
    meetings: z.boolean(),
    weeklyCommitment: z.boolean(),
    
    preferredTeams: z.array(
      z.object({
        teamId: z.string(),
        interestLevel: z.nativeEnum(InterestLevel),
      })
    ).min(1, "Select at least one team"),

    researchAreas: z.array(
      z.object({
        researchAreaId: z.string(),
        interestLevel: z.nativeEnum(InterestLevel),
      })
    ).max(3, "You can select up to three research areas"),

    referralSources: z.array(z.nativeEnum(ReferralSource))
      .min(1, "Please select at least one option"),
  }),

  // Open-Ended Questions Section
  openEndedQuestions: z.object({
    firstQuestion: z.string()
      .min(1, "Answer is required")
      .refine(text => wordCount(text) <= 250, "Answer must be 250 words or less"),
    secondQuestion: z.string()
      .min(1, "Answer is required")
      .refine(text => wordCount(text) <= 250, "Answer must be 250 words or less"),
  }),

  meetingTimes: z
    .array(z.string())
    .min(2, "Select at least a 30 minute window")
    .refine(
      (input) => {
        // make sure a 30 minute window exists in the selected times, where each selected time represents a 15 minute window

        const sortedTimes = input
          .map((time) => Temporal.ZonedDateTime.from(time))
          .sort((a, b) => Temporal.ZonedDateTime.compare(a, b));

        let gridsCount = 1;
        for (let i = 0; i < sortedTimes.length - 1; i++) {
          const curr = sortedTimes[i];
          const next = sortedTimes[i + 1];

          if (next && curr?.add({ minutes: 15 }).equals(next)) {
            gridsCount++;

            if (gridsCount === 2) {
              return true;
            }
          } else {
            gridsCount = 1;
          }
        }

        return false;
      },
      {
        message: "Select at least a 30 minute window",
      },
    ),
  /**
   * File ID of resume in google drive, nullable to allow submitting form to upload file, then updating with actual ID
   */
  resume: z.object({
    resumeId: z.string(),
    signatureCommitment: z.string().min(1, "Commitment signature required"),
    signatureAccountability: z.string().min(1, "Accountability signature required"),
    signatureQuality: z.string().min(1, "Quality pledge required"),
  })
})
.superRefine((data, ctx) => {
  // Validate that research areas belong to selected teams
  const selectedTeamIds = data.thinkTankInfo.preferredTeams.map((team) => team.teamId);
  const validResearchAreaIds = TEAMS.filter((team) =>
    selectedTeamIds.includes(team.id)
  )
    .flatMap((team) => team.researchAreas)
    .map((ra) => ra.id);

  data.thinkTankInfo.researchAreas.forEach((ra, index) => {
    if (!validResearchAreaIds.includes(ra.researchAreaId)) {
      ctx.addIssue({
        code: "custom",
        path: ["thinkTankInfo", "researchAreas", index, "researchAreaId"],
        message:
          "Selected research area must belong to chosen teams",
      });
    }
  });

  const fullName = data.personal.fullName.toLowerCase();
  const signatures = [
    { value: data.resume.signatureCommitment, path: ["resume", "signatureCommitment"] },
    { value: data.resume.signatureAccountability, path: ["resume", "signatureAccountability"] },
    { value: data.resume.signatureQuality, path: ["resume", "signatureQuality"] },
  ];

  signatures.forEach(({ value, path }) => {
    if (!validateSignature(value, fullName)) {
      ctx.addIssue({
        code: "custom",
        path: path,
        message: "Signature must contain part of your first or last name",
      });
    }
  });
});


export type DCMemberApplyForm = z.infer<typeof DCMemberApplyFormSchema>;