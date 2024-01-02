import { Temporal } from "@js-temporal/polyfill";

/**
 * Take times as strings and convert to ZonedDateTime objects in the timezone supplied
 * @param times An array of strings in `HHmm-DDMMYYYY` format
 * @param fromTimezone The timezone the `times` are currently in (default UTC)
 * @param toTimezone The target timezone to convert to (default UTC)
 */
export const convertTimesToDates = (
  times: string[],
  fromTimezone = "UTC",
  toTimezone = "UTC",
) => {
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
      timeZone: fromTimezone,
    }).withTimeZone(toTimezone);
  });
};
