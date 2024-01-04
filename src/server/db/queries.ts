import { db } from ".";

export type dbAvailabilitiesType = Awaited<ReturnType<typeof getAvailabities>>;

export async function getAvailabities() {
  return await db.timeSection.findMany({
    select: {
      gridTime: true,
      officer: {
        select: {
          id: true,
          name: true,
        },
      },
      selectedAt: true,
    },
  });
}
