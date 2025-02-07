import { Temporal } from "@js-temporal/polyfill";
import { ApplicationStatus, Challenge, Year, ReferralSource, Pronoun, Gender, InterestLevel, Major } from "@prisma/client";
import { z } from "zod";

const challengeSchema = z.nativeEnum(Challenge);
const statusSchema = z.nativeEnum(ApplicationStatus);
const yearSchema = z.nativeEnum(Year);
const majorSchema = z.nativeEnum(Major);

export const ApplyFormSchema = z
  .object({
    // Personal info section
    personal: z.object({
      fullName: z.string().min(1, "Full Name is required").max(100, "Name too long"),
      preferredName: z.string().nullable(),
      preferredPronoun: z.nativeEnum(Pronoun).nullable(),
      pronounsText: z.string().nullable(),
      gender: z.nativeEnum(Gender).nullable(),
      genderText: z.string().nullable(),
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
      year: z.nativeEnum(Year),
      major: majorSchema,
      currentClasses: z
        .array(z.string().min(1, "Class cannot be empty"))
        .max(8)
        .refine(classes => 
          classes.every(cls => /^[A-Z]{4} \d{3}$/.test(cls)),
          "All classes must be in format 'XXXX 123'"
        )
        .refine(classes => 
          classes.filter(Boolean).length >= 2, 
          "Enter at least two valid classes"
        ),
      nextClasses: z
        .array(z.string().min(1, "Class cannot be empty"))
        .max(8)
        .refine(classes => 
          classes.every(cls => /^[A-Z]{4} \d{3}$/.test(cls)),
          "All classes must be in format 'XXXX 123'"
        )
        .refine(classes => 
          classes.filter(Boolean).length >= 2, 
          "Enter at least two valid classes"
        ),
      timeCommitment: z
        .array(
          z.object({
            name: z.string()
              .max(50, "Commitment name must be under 50 characters")
              .refine(val => !!val.trim(), "Name is required"),
            hours: z.number()
              .min(1, "Minimum 1 hour required")
              .max(15, "Cannot exceed 15 hours"),
            type: z.enum(["CURRENT", "PLANNED"]),
          })
        )
        .superRefine((commitments, ctx) => {
          commitments.forEach((commitment, index) => {
            if (commitment.hours >= 1 && !commitment.name.trim()) {
              ctx.addIssue({
                code: "custom",
                path: ["academic", "timeCommitment", index, "name"],
                message: "Name is required when hours are specified",
              });
            }
          });
        }),
    }),

    // ThinkTank Information Section
    thinkTankInfo: z.object({
      meetings: z.boolean(), // Can attend meetings in person?
      weeklyCommitment: z.boolean(), // Can commit to weekly workload?
      // Preferred Teams Validation
      preferredTeams: z.array(
        z.object({
          teamId: z.string(), // Validate by team ID or name
          interestLevel: z.nativeEnum(InterestLevel), // HIGH/MEDIUM/LOW
        })
      ),

      // Research Areas Validation
      researchAreas: z.array(
        z.object({
          researchAreaId: z.string(), // Validate by research area ID or name
          interestLevel: z.nativeEnum(InterestLevel), // HIGH/MEDIUM/LOW
        })
      ).max(3, "You can select up to three research areas"),

      referralSources: z.array(z.nativeEnum(ReferralSource)),
    }),

    // Open-Ended Questions Section
    openEndedQuestions: z.object({
      passionAnswer: z.string().min(1).max(250, "Answer must be under 250 words"),
      teamworkAnswer: z.string().min(1).max(250, "Answer must be under 250 words"),
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

  .superRefine((data, ctx) => {
    // Check if pronounsText is required when preferredPronoun is OTHER
    if (data.personal.preferredPronoun === "OTHER" && !data.personal.pronounsText?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["personal", "pronounsText"],
        message: "Please specify your pronouns if 'Other' is selected.",
      });
    }

    // Check if genderText is required when gender is OTHER
    if (data.personal.gender === "OTHER" && !data.personal.genderText?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["personal", "genderText"],
        message: "Please specify your gender if 'Other' is selected.",
      });
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
