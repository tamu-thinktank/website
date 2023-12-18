import { Prisma } from "@prisma/client";

const applicationWithChallenges =
  Prisma.validator<Prisma.ApplicationDefaultArgs>()({
    include: {
      challenges: {
        select: {
          challenge: true,
        },
      },
    },
  });

export type dbApplicationType = Prisma.ApplicationGetPayload<
  typeof applicationWithChallenges
>;
