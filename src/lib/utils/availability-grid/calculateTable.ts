import { times } from "@/consts/availability-grid";
import { Temporal } from "@js-temporal/polyfill";
import { calculateColumns } from "./calculateColumns";
import { calculateRows } from "./calculateRows";

export interface CellData {
  cellInUTC: string;
  minute: number;
  label: string;
}

/**
 * Take times in availability grid and turn them into a data structure representing an availability table
 */
export const calculateTable = (timezone: string) => {
  const locale = "en-US";
  const userDateTimes = times.map((time) =>
    Temporal.ZonedDateTime.from(time).withTimeZone(timezone),
  );
  const rows = calculateRows(userDateTimes);
  const columns = calculateColumns(userDateTimes);

  return {
    rows: rows.map((row) =>
      row && row.minute === 0
        ? {
            label: row.toLocaleString(locale, {
              hour: "numeric",
              hourCycle: "h12",
            }),
          }
        : null,
    ),

    columns: columns.map((column) =>
      column
        ? {
            header: {
              dateLabel: column.toLocaleString(locale, {
                month: "short",
                day: "numeric",
              }),
              weekdayLabel: column.toLocaleString(locale, { weekday: "short" }),
            },
            cells: rows.map((row) => {
              if (!row) return null;

              const cellDateTime = column.toZonedDateTime({
                plainTime: row,
                timeZone: timezone,
              });
              const cellInUTC = cellDateTime.withTimeZone("UTC").toString();

              // Cell not in dates
              if (
                !userDateTimes.some(
                  (time) =>
                    Temporal.ZonedDateTime.compare(cellDateTime, time) === 0,
                )
              )
                return null;

              return {
                /**
                 * ZonedDateTime ISO
                 */
                cellInUTC,
                minute: cellDateTime.minute,
                label: cellDateTime.toLocaleString(locale, {
                  dateStyle: "long",
                  timeStyle: "short",
                  hourCycle: "h12",
                }),
              } satisfies CellData;
            }),
          }
        : null,
    ),
  };
};
