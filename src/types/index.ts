import { type Temporal } from "@js-temporal/polyfill";

export type TimeRange = {
  /** DateTime at beginning of table */
  startDateTime: Temporal.ZonedDateTime;
  /** DateTime at end of table */
  endDateTime: Temporal.ZonedDateTime;
};
