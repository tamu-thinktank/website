import { Temporal } from "@js-temporal/polyfill";
import {
  ApplicationStatus,
  Availability,
  Challenge,
  Year,
} from "@prisma/client";
import { z } from "zod";

const charLimit = 1000;

const challengeSchema = z.nativeEnum(Challenge);
const statusSchema = z.nativeEnum(ApplicationStatus);
const yearSchema = z.nativeEnum(Year);
const availabilitySchema = z.nativeEnum(Availability);

export const ApplyFormSchema = z
  .object({
    id: z.string().cuid2(),

    // Personal info section
    personal: z.object({
      fullName: z.string().min(1, "Required"),
      email: z
        .string()
        .email("Invalid email")
        .regex(/@tamu.edu$/, "Must end with @tamu.edu"),
      uin: z.coerce
        .number()
        .refine((n) => !isNaN(n), { message: "Required" })
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
      availability: availabilitySchema,
    }),

    // Interests and Motivation section
    interests: z.object({
      interestedAnswer: z
        .string()
        .max(charLimit, "Responses must be within 1000 characters"),
      challenges: z.array(challengeSchema).min(1),
      interestedChallenge: challengeSchema,
      passionAnswer: z
        .string()
        .max(charLimit, "Responses must be within 1000 characters"),
      isLeadership: z.coerce.boolean(),
    }),

    // Leadership section
    leadership: z.object({
      skillsAnswer: z
        .string()
        .max(charLimit, "Responses must be within 1000 characters")
        .nullable(),
      conflictsAnswer: z
        .string()
        .max(charLimit, "Responses must be within 1000 characters")
        .nullable(),
      presentation: z.coerce.number().min(1).max(5).nullable(),
      timeManagement: z
        .string()
        .max(charLimit, "Responses must be within 1000 characters")
        .nullable(),
    }),

    meetingTimes: z
      .array(z.string())
      .min(4)
      .refine(
        (input) => {
          // make sure a 30 minute window exists in the selected times, where each selected time represents a 15 minute window

          const sortedTimes = input
            .map((time) => Temporal.ZonedDateTime.from(time))
            .sort((a, b) => Temporal.ZonedDateTime.compare(a, b));

          let gridsCount = 1;
          for (let i = 0; i < sortedTimes.length - 1; i++) {
            const curr = sortedTimes[i]!;
            const next = sortedTimes[i + 1]!;

            if (curr.add({ minutes: 15 }).equals(next)) {
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
  }),
);
