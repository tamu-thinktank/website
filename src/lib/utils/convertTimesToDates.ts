import { Temporal } from "@js-temporal/polyfill";

/**
 * Take times as strings in UTC and convert to ZonedDateTime objects in the timezone supplied (default UTC)
 * @param times An array of strings in `HHmm-DDMMYYYY` format
 * @param timezone The target timezone
 */
export const convertTimesToDates = (
  times: string[],
  timezone = "UTC",
): Temporal.ZonedDateTime[] => {
  return times.map((time) => {
    if (time.length !== 13) {
      throw new Error("String must be in HHmm-DDMMYYYY format");
    }

    // Extract values
    const [hour, minute] = [
      Number(time.substring(0, 2)),
      Number(time.substring(2, 4)),
    ];
    const [day, month, year] = [
      Number(time.substring(5, 7)),
      Number(time.substring(7, 9)),
      Number(time.substring(9)),
    ];

    return Temporal.ZonedDateTime.from({
      hour,
      minute,
      day,
      month,
      year,
      timeZone: timezone,
    });
  });
};
