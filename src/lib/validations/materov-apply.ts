import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import {
  ReferralSource,
  InterestLevel,
  ExperienceLevel,
  LearningInterestLevel,
} from "@prisma/client";
import {
  yearSchema,
  majorSchema,
  classSchema,
  PRESET_PRONOUNS,
  PRESET_GENDERS,
  wordCount,
  validateSignature,
} from "./apply";

export const MATEROVApplyFormSchema = z
  .object({
    // Personal info section
    personal: z.object({
      fullName: z
        .string()
        .min(1, "Full Name is required")
        .max(100, "Name too long"),
      preferredName: z.string().nullable(),
      pronouns: z
        .string()
        .refine(
          (val) =>
            PRESET_PRONOUNS.includes(val) ||
            (val.startsWith("OTHER:") && val.length > 7) ||
            !val, // allows empty value
          "Invalid or incomplete pronouns",
        )
        .optional(), // makes field optional

      gender: z
        .string()
        .refine(
          (val) =>
            PRESET_GENDERS.includes(val) ||
            (val.startsWith("OTHER:") && val.length > 7) ||
            !val, // allows empty value
          "Invalid or incomplete gender",
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
      currentClasses: z.array(classSchema).min(2, "Enter at least two classes"),
      nextClasses: z.array(classSchema).min(2, "Enter at least two classes"),
      timeCommitment: z
        .array(
          z.object({
            name: z.string().min(1, "Name is required"),
            hours: z
              .number()
              .min(1, "Minimum 1 hour required")
              .max(15, "Cannot exceed 15 hours"),
            type: z.enum(["CURRENT", "PLANNED"]),
          }),
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
          },
        ),
    }),

    // ThinkTank Information
    thinkTankInfo: z.object({
      meetings: z.boolean(),
      weeklyCommitment: z.boolean(),
      subteamPreferences: z
        .array(
          z.object({
            name: z.string().min(1, "Subteam name is required"),
            interest: z.nativeEnum(InterestLevel),
          }),
        )
        .min(1, "Select at least one subteam"),
      skills: z
        .array(
          z.object({
            name: z.string().min(1, "Skill name is required"),
            experienceLevel: z.nativeEnum(ExperienceLevel),
          }),
        )
        .min(1, "Select at least one skill"),
      learningInterests: z
        .array(
          z.object({
            area: z.string().min(1, "Learning area is required"),
            interestLevel: z.nativeEnum(LearningInterestLevel),
          }),
        )
        .min(1, "Select at least one learning interest"),
      previousParticipation: z.boolean(),
      referralSources: z
        .array(z.nativeEnum(ReferralSource))
        .min(1, "Please select at least one option"),
    }),

    // Open-Ended Questions Section
    openEndedQuestions: z.object({
      firstQuestion: z
        .string()
        .min(1, "Answer is required")
        .refine(
          (text) => wordCount(text) <= 250,
          "Answer must be 250 words or less",
        ),
      secondQuestion: z
        .string()
        .min(1, "Answer is required")
        .refine(
          (text) => wordCount(text) <= 250,
          "Answer must be 250 words or less",
        ),
      thirdQuestion: z
        .string()
        .min(1, "Answer is required")
        .refine(
          (text) => wordCount(text) <= 250,
          "Answer must be 250 words or less",
        ),
    }),

    // Interview Times
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

    // Resume & Signatures
    resume: z.object({
      resumeId: z.string(),
      signatureCommitment: z.string().min(1, "Commitment signature required"),
      signatureAccountability: z
        .string()
        .min(1, "Accountability signature required"),
      signatureQuality: z.string().min(1, "Quality pledge required"),
    }),
  })
  .superRefine((data, ctx) => {
    // Validate that signature strings include a part of the applicant's first or last name.
    const fullName = data.personal.fullName.toLowerCase();
    const signatures = [
      {
        value: data.resume.signatureCommitment,
        path: ["resume", "signatureCommitment"],
      },
      {
        value: data.resume.signatureAccountability,
        path: ["resume", "signatureAccountability"],
      },
      {
        value: data.resume.signatureQuality,
        path: ["resume", "signatureQuality"],
      },
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

export type MATEROVApplyForm = z.infer<typeof MATEROVApplyFormSchema>;
