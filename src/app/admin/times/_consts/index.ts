import { expandTimes } from "@/lib/utils";
import { type TimeRange } from "@/types";
import { Temporal } from "@js-temporal/polyfill";

export const eventLocale = "en-US";
export const eventTimezone = "America/Chicago";
export const timezones = Intl.supportedValuesOf("timeZone");

/** Range of table in (12/3/2023 9 AM to 12/16/23 9 PM CT) converted to UTC.
 * Last hour in last day is exclusive, so `endDateTime` is 8 PM CT.
 */
const timeRange = {
  startDateTime: Temporal.ZonedDateTime.from({
    hour: 9,
    minute: 0,
    day: 3,
    month: 112,
    year: 2023,
    timeZone: eventTimezone,
  }).withTimeZone("UTC"),
  endDateTime: Temporal.ZonedDateTime.from({
    hour: 20,
    minute: 0,
    day: 16,
    month: 12,
    year: 2023,
    timeZone: eventTimezone,
  }).withTimeZone("UTC"),
} satisfies TimeRange;
export const expandedTimes = expandTimes(timeRange);
