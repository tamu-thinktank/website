import { z } from "zod";
import {
  yearSchema,
  majorSchema,
  classSchema,
  PRESET_PRONOUNS,
  PRESET_GENDERS,
  wordCount,
  validateSignature,
} from "./apply";

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
      currentClasses: z.array(classSchema).min(2, "Enter at least two classes"),
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
      weeklyCommitment: z.boolean(),
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
