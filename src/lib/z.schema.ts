import { Availability, Challenge, Year } from "@prisma/client";
import { z } from "zod";

const challengeSchema = z.nativeEnum(Challenge);
const charLimit = 1000;

export const ApplyFormSchema = z
  .object({
    id: z.string().cuid2(),

    // Personal info section
    personal: z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      uin: z.coerce
        .number()
        .positive()
        .refine((n) => /^\d{3}00\d{4}$/.test(n.toString()), {
          message: "Invalid UIN",
        }),
      altEmail: z
        .string()
        .nullable()
        .refine(
          (input) => {
            // email check after to validate empty string
            if (input?.length) {
              return z.string().email().safeParse(input).success;
            }

            return true;
          },
          {
            message: "Invalid email",
          },
        ),
      phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/),
      year: z.nativeEnum(Year),
      major: z
        .string()
        .length(4)
        .refine((input) => /^[A-Za-z]{4}$/.test(input), {
          message: "Not a valid major abbreviation",
        }),
      availability: z.nativeEnum(Availability),
    }),

    // Interests and Motivation section
    interests: z.object({
      interestedAnswer: z.string().max(charLimit),
      challenges: z.array(challengeSchema).min(1),
      interestedChallenge: challengeSchema,
      passionAnswer: z.string().max(charLimit),
      isLeadership: z.coerce.boolean(),
    }),

    // Leadership section
    leadership: z.object({
      skillsAnswer: z.string().max(charLimit).nullable(),
      conflictsAnswer: z.string().max(charLimit).nullable(),
      presentation: z.coerce.number().min(1).max(5).nullable(),
      timeManagement: z.string().max(charLimit).nullable(),
    }),

    // Resume section
    resumeLink: z.string(),
  })
  .superRefine(({ interests: { isLeadership }, leadership }, ctx) => {
    if (isLeadership) {
      if (!leadership.skillsAnswer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadership.skillsAnswer"],
          message: "Required for leadership",
        });
      }
      if (!leadership.conflictsAnswer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadership.conflictsAnswer"],
          message: "Required for leadership",
        });
      }
      if (!leadership.presentation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadership.presentation"],
          message: "Required for leadership",
        });
      }
      if (!leadership.timeManagement) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadership.timeManagement"],
          message: "Required for leadership",
        });
      }
    }
  });
