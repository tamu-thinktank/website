import { expandTimes } from "@/lib/utils/availability-grid/expandTimes";
import { Temporal } from "@js-temporal/polyfill";
import colors from "tailwindcss/colors";

export const eventTimezone = "America/Chicago";
export const timezones = Intl.supportedValuesOf("timeZone");
export type Mode = "add" | "remove";

/** Range of table: (12/3/2023 9 AM to 12/16/23 9 PM CT) coverted to UTC.
 * Last hour in last day is exclusive, so `endDateTime` is 8 PM CT.
 * Fomat of ZonedDateTime ISO
 */
export const times = expandTimes({
  startDateTime: Temporal.ZonedDateTime.from({
    timeZone: eventTimezone,
    year: 2024,
    month: 1,
    day: 22,
    hour: 9,
  }).withTimeZone("UTC"),
  endDateTime: Temporal.ZonedDateTime.from({
    timeZone: eventTimezone,
    year: 2024,
    month: 2,
    day: 2,
    hour: 20,
  }).withTimeZone("UTC"),
});

/**
 * default tailwind colors (minus gray-ish colors) at 400 - 700
 * */
export const palette = (
  Object.keys(colors).filter(
    (c) =>
      c !== "inherit" &&
      c !== "current" &&
      c !== "transparent" &&
      c !== "black" &&
      c !== "white" &&
      c !== "gray" &&
      c !== "slate" &&
      c !== "neutral" &&
      c !== "stone" &&
      c !== "zinc" &&
      c !== "lightBlue" &&
      c !== "warmGray" &&
      c !== "trueGray" &&
      c !== "coolGray" &&
      c !== "blueGray",
  ) as (keyof typeof colors)[]
).flatMap((color: keyof typeof colors) => [
  colors[color][400],
  colors[color][500],
  colors[color][600],
  colors[color][700],
]);
