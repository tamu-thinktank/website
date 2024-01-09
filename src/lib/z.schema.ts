import { Temporal } from "@js-temporal/polyfill";
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
      email: z.string().email("Invalid email").refine((input) => /@tamu.edu$/.test(input), {message: "Must end with @tamu.edu"}), 
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
      phone: z.string().refine((input) => /^\d{3}-\d{3}-\d{4}$/.test(input), {message: "Invalid phone number"}),
      year: z.nativeEnum(Year),
      major: z
        .string()
        .refine((input) => /^[A-Za-z]{4}$/.test(input), {
          message: "Not a valid 4 letter major abbreviation",
        }),
      availability: z.nativeEnum(Availability),
    }),

    // Interests and Motivation section
    interests: z.object({
      interestedAnswer: z.string().max(charLimit, "Responses must be within 1000 characters"),
      challenges: z.array(challengeSchema).min(1),
      interestedChallenge: challengeSchema,
      passionAnswer: z.string().max(charLimit, "Responses must be within 1000 characters"),
      isLeadership: z.coerce.boolean(),
    }),

    // Leadership section
    leadership: z.object({
      skillsAnswer: z.string().max(charLimit, "Responses must be within 1000 characters").nullable(),
      conflictsAnswer: z.string().max(charLimit, "Responses must be within 1000 characters").nullable(),
      presentation: z.coerce.number().min(1).max(5).nullable(),
      timeManagement: z.string().max(charLimit, "Responses must be within 1000 characters").nullable(),
    }),

    meetingTimes: z
      .array(z.string())
      .min(4)
      .refine(
        (input) => {
          // make sure an hour window exists in the selected times, where each selected time represents a 15 minute window

          const sortedTimes = input
            .map((time) => Temporal.ZonedDateTime.from(time))
            .sort((a, b) => Temporal.ZonedDateTime.compare(a, b));

          let toHourCount = 1;
          for (let i = 0; i < sortedTimes.length - 1; i++) {
            const curr = sortedTimes[i]!;
            const next = sortedTimes[i + 1]!;

            if (curr.add({ minutes: 15 }).equals(next)) {
              toHourCount++;

              if (toHourCount === 4) {
                return true;
              }
            } else {
              toHourCount = 1;
            }
          }

          return false;
        },
        {
          message: "Select at least an hour window",
        },
      ),
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

/**
 * Map of gridTimes from db to officers available at that time
 */
export const AvailabilityMapSchema = z.map(
  z.string(),
  z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      selectedAt: z.string(),
    }),
  ),
);
export type AvailabilityMap = z.infer<typeof AvailabilityMapSchema>;
