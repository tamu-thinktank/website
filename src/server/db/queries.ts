import type { Prisma, Challenge } from "@prisma/client";
import { db } from "../../lib/db";

export type dbAvailabilitiesType = Awaited<ReturnType<typeof getAvailabities>>;

export async function getAvailabities(officerIds?: string[]) {
  return await db.officerTime.findMany({
    where: {
      officerId: {
        in: officerIds,
      },
    },
    select: {
      gridTime: true,
      officer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      selectedAt: true,
    },
  });
}

export const getTargetTeams = async (
  userId: string,
  tx?: Prisma.TransactionClient,
): Promise<Challenge[]> => {
  const result = await (tx ?? db).user.findUnique({
    where: {
      id: userId,
    },
    select: {
      targetTeams: true,
    },
  });
  
  return (result?.targetTeams ?? []) as Challenge[];
};

export const getAllApplications = async () => {
  return await db.application.findMany();
};
