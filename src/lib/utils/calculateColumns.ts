import { splitArrayBy } from "@giraugh/tools";
import { Temporal } from "@js-temporal/polyfill";

/**
 * Calculates the columns required for an availability grid
 * @returns An array of PlainDate or null, where null indicates a spacer column between dates
 */
export const calculateColumns = (
  dates: Temporal.ZonedDateTime[],
): (Temporal.PlainDate | null)[] => {
  // Dedupe dates by date and sort
  const sortedDates = Array.from(
    new Map(
      dates.map((d) => {
        const plain = d.toPlainDate();
        return [plain.toString(), plain];
      }),
    ).values(),
  ).sort((a, b) => Temporal.PlainDate.compare(a, b));

  // Partition by distance
  const partitionedDates = splitArrayBy(
    sortedDates,
    (a, b) => !(Temporal.PlainDate.compare(a.add({ days: 1 }), b) === 0),
  );

  // Join
  return partitionedDates.reduce(
    (columns, partition, i) => [
      ...columns,
      ...partition,
      ...(i < partitionedDates.length - 1 ? [null] : []), // Add spacer in between partitions
    ],
    [] as (Temporal.PlainDate | null)[],
  );
};
