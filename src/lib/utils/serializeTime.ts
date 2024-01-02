import { type Temporal } from "@js-temporal/polyfill";

/**
 * Takes a ZonedDateTime in any timezone, and serializes it in UTC
 * @returns Time serialized to UTC `HHmm-DDMMYYYY` format
 */
export const serializeTime = (time: Temporal.ZonedDateTime) => {
  const t = time.withTimeZone("UTC");
  const [hour, minute, day, month] = [t.hour, t.minute, t.day, t.month].map(
    (x) => x.toString().padStart(2, "0"),
  );
  const year = t.year.toString().padStart(4, "0");

  return `${hour}${minute}-${day}${month}${year}`;
};
