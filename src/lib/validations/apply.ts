import { longAnswerLimit } from "@/consts/apply-form";
import { Temporal } from "@js-temporal/polyfill";
import { ApplicationStatus, Challenge, Year } from "@prisma/client";
import { z } from "zod";

const challengeSchema = z.nativeEnum(Challenge);
const statusSchema = z.nativeEnum(ApplicationStatus);
const yearSchema = z.nativeEnum(Year);

export const ApplyFormSchema = z
  .object({
    // Personal info section
    personal: z.object({
      fullName: z.string().min(1, "Required"),
      email: z
        .string()
        .email("Invalid email")
        .regex(/@tamu.edu$/, "Must end with @tamu.edu"),
      uin: z.coerce
        .number({
          invalid_type_error: "Expected a number",
        })
        .refine((n) => /^\d{3}00\d{4}$/.test(n.toString()), {
          message: "Invalid UIN",
        }),
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
      year: yearSchema,
      major: z
        .string()
        .regex(/^[A-Za-z]{4}$/, "Not a valid 4 letter major abbreviation"),
      availability: z.boolean(),
    }),

    // Interests and Motivation section
    interests: z.object({
      interestedAnswer: z
        .string()
        .min(1, "Required")
        .max(longAnswerLimit, "Responses must be within 1000 characters"),
      challenges: z.array(challengeSchema).min(1, "Select at least one"),
      interestedChallenge: challengeSchema,
      passionAnswer: z
        .string()
        .min(1, "Required")
        .max(longAnswerLimit, "Responses must be within 1000 characters"),
      isLeadership: z.boolean(),
    }),

    // Leadership section
    leadership: z.object({
      skillsAnswer: z
        .string()
        .max(longAnswerLimit, "Responses must be within 1000 characters")
        .nullable(),
      conflictsAnswer: z
        .string()
        .max(longAnswerLimit, "Responses must be within 1000 characters")
        .nullable(),
      timeManagement: z
        .string()
        .max(longAnswerLimit, "Responses must be within 1000 characters")
        .nullable(),
      relevantExperience: z
        .string()
        .max(longAnswerLimit, "Responses must be within 1000 characters")
        .nullable(),
      timeCommitment: z.boolean().nullable(),
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
    resumeId: z.string(),
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
      if (!leadership.timeManagement) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadership.timeManagement"],
          message: "Required for leadership",
        });
      }
      if (!leadership.relevantExperience) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadership.relevantExperience"],
          message: "Required for leadership",
        });
      }
      if (leadership.timeCommitment === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadership.timeCommitment"],
          message: "Required for leadership",
        });
      }
    }
  });
export type ApplyForm = z.infer<typeof ApplyFormSchema>;

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
