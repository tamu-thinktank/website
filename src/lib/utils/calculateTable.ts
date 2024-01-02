import { Temporal } from "@js-temporal/polyfill";
import { convertTimesToDates } from ".";
import { calculateColumns } from "./calculateColumns";
import { calculateRows } from "./calculateRows";
import { serializeTime } from "./serializeTime";

export interface CalculateTableArgs {
  /** times in table in UTC */
  times: string[];
  /** Timezone to display the table in */
  timezone: string;
}

/**
 * Take time range and turn them into a data structure representing an availability table
 */
export const calculateTable = ({ times, timezone }: CalculateTableArgs) => {
  const locale = "en-US";
  const userDateTimes = convertTimesToDates(times, "UTC", timezone);
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
              const cellInUTC = serializeTime(cellDateTime);

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
                 * `HHmm-DDMMYYYY`format
                 */
                cellInUTC,
                minute: cellDateTime.minute,
                label: cellDateTime.toLocaleString(locale, {
                  dateStyle: "long",
                  timeStyle: "short",
                  hourCycle: "h12",
                }),
              };
            }),
          }
        : null,
    ),
  };
};
