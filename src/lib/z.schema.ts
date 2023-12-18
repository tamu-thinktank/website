import { Availability, Challenge, Year } from "@prisma/client";
import { z } from "zod";

const challengeSchema = z.nativeEnum(Challenge);

export const ApplyFormSchema = z
  .object({
    id: z.string().cuid2(),
    fullName: z.string(),
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
          if (input?.length && input.length > 0) {
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
    interestedAnswer: z.string().max(1000),
    challenges: z
      .array(
        z.object({
          challenge: challengeSchema,
        }),
      )
      .min(1),
    interestedChallenge: challengeSchema,
    passionAnswer: z.string().max(1000),
    isLeadership: z.coerce.boolean(),
    skillsAnswer: z.string().max(1000).nullable(),
    conflictsAnswer: z.string().max(1000).nullable(),
    presentation: z.preprocess((val) => {
      if (!val) return 1;

      const casted = val as unknown as number[];
      const lastElm = casted[casted.length - 1];
      if (!lastElm) return 1;

      return lastElm + 1;
    }, z.number().min(1).max(5).nullable()),
    timeManagement: z.string().max(1000).nullable(),
    resumeLink: z.string(),
  })
  .refine(
    (data) => {
      if (data.isLeadership) {
        return (
          data.skillsAnswer &&
          data.conflictsAnswer &&
          data.presentation &&
          data.timeManagement
        );
      }

      return true;
    },
    {
      path: [
        "skillsAnswer",
        "conflictsAnswer",
        "presentation",
        "timeManagement",
      ],
      message: "Required for leadership",
    },
  );
