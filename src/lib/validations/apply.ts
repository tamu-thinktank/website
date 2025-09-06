import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";
import {
  ApplicationStatus,
  Year,
  ReferralSource,
  InterestLevel,
  Major,
  OfficerCommitment,
  OfficerPosition,
  ExperienceLevel,
  LearningInterestLevel,
} from "@prisma/client";

const statusSchema = z.nativeEnum(ApplicationStatus);
const yearSchema = z.nativeEnum(Year);
const majorSchema = z.nativeEnum(Major);
const PRESET_PRONOUNS = ["HE_HIM", "SHE_HER", "THEY_THEM"] as const;
const PRESET_GENDERS = ["MALE", "FEMALE", "NON_BINARY"] as const;
const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;
const validateSignature = (signature: string, fullName: string): boolean => {
  const [firstName = "", lastName = ""] = fullName.toLowerCase().split(" ");
  return (
    signature.toLowerCase().includes(firstName) ||
    signature.toLowerCase().includes(lastName)
  );
};

export const ApplyFormSchema = z
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
      currentClasses: z
        .array(z.string().nullable().default(""))
        .length(7)
        .refine(
          (classes) => {
            const nonEmptyClasses = classes.filter(cls => cls && cls.trim() !== "");
            return nonEmptyClasses.length >= 2;
          },
          "Enter at least two valid current classes",
        )
        .refine(
          (classes) =>
            classes.every((cls) =>
              !cls || cls.trim() === "" || /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{4}|NULL 101)$/.test(cls),
            ),
          "All non-empty classes must be in format 'XXXX 123', 'XXXXb1234' (Blinn), or 'NULL 101'",
        )
        .transform(classes => classes.map(cls => cls || "")),
      nextClasses: z
        .array(z.string().nullable().default(""))
        .length(7)
        .refine(
          (classes) => {
            const nonEmptyClasses = classes.filter(cls => cls && cls.trim() !== "");
            return nonEmptyClasses.length >= 2;
          },
          "Enter at least two valid planned classes",
        )
        .refine(
          (classes) =>
            classes.every((cls) =>
              !cls || cls.trim() === "" || /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{4}|NULL 101)$/.test(cls),
            ),
          "All non-empty classes must be in format 'XXXX 123', 'XXXXb1234' (Blinn), or 'NULL 101'",
        )
        .transform(classes => classes.map(cls => cls || "")),
      currentCommitmentHours: z.union([
        z.string().transform(val => val === "" ? 0 : Number(val)), 
        z.number()
      ]).refine(val => val >= 0 && val <= 40, "Must be between 0 and 40 hours").optional(),
      plannedCommitmentHours: z.union([
        z.string().transform(val => val === "" ? 0 : Number(val)), 
        z.number()
      ]).refine(val => val >= 0 && val <= 40, "Must be between 0 and 40 hours").optional(),
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
        .default([]),
    }),

    // ThinkTank Information Section
    thinkTankInfo: z.object({
      meetings: z.boolean(),
      weeklyCommitment: z.boolean(),

      preferredTeams: z
        .array(
          z.object({
            teamId: z.string(),
            ranking: z.number().min(1, "Ranking must be at least 1"),
          }),
        )
        .min(1, "Select at least one team"),

      // Remove research areas validation for design challenges
      researchAreas: z
        .array(
          z.object({
            researchAreaId: z.string(),
            interestLevel: z.nativeEnum(InterestLevel),
          }),
        )
        .optional()
        .default([]),

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
      signatureAccountability: z
        .string()
        .min(1, "Accountability signature required"),
      signatureQuality: z.string().min(1, "Quality pledge required"),
    }),
  })

  .superRefine((data, ctx) => {
    // Validate team rankings are unique and sequential
    const selectedTeams = data.thinkTankInfo.preferredTeams;
    if (selectedTeams.length > 0) {
      const rankings = selectedTeams.map(t => t.ranking);
      const uniqueRankings = new Set(rankings);
      
      // Check for duplicate rankings
      if (uniqueRankings.size !== rankings.length) {
        ctx.addIssue({
          code: "custom",
          path: ["thinkTankInfo", "preferredTeams"],
          message: "Each team must have a unique ranking",
        });
      }
      
      // Check rankings are sequential starting from 1
      const sortedRankings = [...rankings].sort((a, b) => a - b);
      for (let i = 0; i < sortedRankings.length; i++) {
        if (sortedRankings[i] !== i + 1) {
          ctx.addIssue({
            code: "custom",
            path: ["thinkTankInfo", "preferredTeams"],
            message: "Team rankings must be sequential starting from 1",
          });
          break;
        }
      }
    }

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

export type ApplyForm = z.infer<typeof ApplyFormSchema>;

export const OfficerApplyFormSchema = z
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
      summerPlans: z.string().refine((text) => wordCount(text) <= 100, {
        message: "Summer Plans must be 100 words or less",
      }),
      currentClasses: z
        .array(z.string())
        .min(2, "Enter at least two classes")
        .refine(
          (classes) =>
            classes.every((cls) =>
              /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{4}|NULL 101)$/.test(cls),
            ),
          "All classes must be in format 'XXXX 123' or 'XXXXb1234' (for courses at Blinn) or 'NULL 101' if courses are withheld.",
        ),
      nextClasses: z
        .array(z.string())
        .min(2, "Enter at least two classes")
        .refine(
          (classes) =>
            classes.every((cls) =>
              /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{3}|NULL 101)$/.test(cls),
            ),
          "All classes must be in format 'XXXX 123' or 'XXXXb1234' (for courses at Blinn) or 'NULL 101' if courses are withheld.",
        ),
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
        .default([]),
    }),

    // ThinkTank Information
    thinkTankInfo: z.object({
      // Officer-specific commitment (MCQ with options YES, PARTIAL, NO)
      officerCommitment: z.nativeEnum(OfficerCommitment, {
        errorMap: () => ({ message: "Officer commitment is required" }),
      }),
      // Preferred Positions: Require at least one selection along with an interest level
      preferredPositions: z
        .array(
          z.object({
            position: z.nativeEnum(OfficerPosition),
            interestLevel: z.nativeEnum(InterestLevel),
          }),
        )
        .min(1, "Select at least one preferred position"),
      // Referral sources remain the same
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
    }),

    // Interview Times (reuse existing scheduling logic)
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

export type OfficerApplyForm = z.infer<typeof OfficerApplyFormSchema>;

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
      currentClasses: z
        .array(z.string())
        .min(2, "Enter at least two classes")
        .refine(
          (classes) =>
            classes.every((cls) =>
              /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{4}|NULL 101)$/.test(cls),
            ),
          "All classes must be in format 'XXXX 123' or 'XXXXb1234' (for courses at Blinn) or 'NULL 101' if courses are withheld.",
        ),
      nextClasses: z
        .array(z.string())
        .min(2, "Enter at least two classes")
        .refine(
          (classes) =>
            classes.every((cls) =>
              /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{3}|NULL 101)$/.test(cls),
            ),
          "All classes must be in format 'XXXX 123' or 'XXXXb1234' (for courses at Blinn) or 'NULL 101' if courses are withheld.",
        ),
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
        .default([]),
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

export const MiniDCApplyFormSchema = z
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
      currentClasses: z
        .array(z.string())
        .min(2, "Enter at least two classes")
        .refine(
          (classes) =>
            classes.every((cls) =>
              /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{4}|NULL 101)$/.test(cls),
            ),
          "All classes must be in format 'XXXX 123' or 'XXXXb1234' (for courses at Blinn) or 'NULL 101' if courses are withheld.",
        ),
      timeCommitment: z
        .array(
          z.object({
            name: z.string().min(1, "Name is required"),
            hours: z
              .number()
              .min(0, "Hours cannot be negative")
              .max(15, "Cannot exceed 15 hours"),
            type: z.enum(["CURRENT", "PLANNED"]),
          }),
        )
        .optional()
        .default([]),
      weeklyCommitment: z.boolean().refine((val) => val === true, {
        message: "You must be able to commit 5-7 hours per week to your team",
      }),
    }),

    // Open-Ended Questions Section
    openEndedQuestions: z.object({
      previousApplication: z
        .string()
        .refine(
          (text) => wordCount(text) <= 250,
          "Answer must be 250 words or less",
        ),
      goals: z
        .string()
        .min(1, "Answer is required")
        .refine(
          (text) => wordCount(text) <= 250,
          "Answer must be 250 words or less",
        ),
    }),

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

export type MiniDCApplyForm = z.infer<typeof MiniDCApplyFormSchema>;

/**
 * Map of gridTimes from db to officers available at that time
 */
export const AvailabilityMapSchema = z.map(
  z.string(),
  z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      selectedAt: z.string(),
    }),
  ),
);
export type AvailabilityMap = z.infer<typeof AvailabilityMapSchema>;

/**
 * For list of applicants in admin page
 */
export const ApplicantsSchema = z.array(
  z.object({
    id: z.string().cuid2(),
    fullName: z.string(),
    email: z.string().email(),
    submittedAt: z.date(),
    status: statusSchema,
  }),
);

/**
 * For applicant detail page
 */
export const ApplicantSchema = ApplyFormSchema.and(
  z.object({
    submittedAt: z.date(),
    status: statusSchema,
    location: z.string().nullable(),
  }),
);
