import { expandTimes } from "@/lib/utils";
import { type TimeRange } from "@/types";

export const eventTimezone = "America/Chicago";
export const timezones = Intl.supportedValuesOf("timeZone");

/** Range of table in (12/3/2023 9 AM to 12/16/23 9 PM CT).
 * Format: HHmm-ddMMyyyy (in CT)
 * Last hour in last day is exclusive, so `endDateTime` is 8 PM CT.
 */
const timeRange = {
  startDateTime: "0900-03122023",
  endDateTime: "2000-16122023",
} satisfies TimeRange;
export const expandedTimes = expandTimes(timeRange, eventTimezone);
