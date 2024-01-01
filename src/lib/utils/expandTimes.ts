import { type TimeRange } from "@/types";
import { Temporal } from "@js-temporal/polyfill";

/**
 * Takes timeRange and as adds 15, 30 and 45 minute variants for every hour in every day
 */
export const expandTimes = (timeRange: TimeRange): Temporal.ZonedDateTime[] => {
  const { startDateTime, endDateTime } = timeRange;
  const startHour = startDateTime.hour;
  const endHour = endDateTime.hour;
  const hourRange =
    endHour > startHour ? endHour - startHour : 24 - startHour + endHour;

  const times = [];
  let addedNextDay = false;
  for (
    let dateTime = startDateTime;
    Temporal.ZonedDateTime.compare(dateTime, endDateTime) <= 0;
    dateTime = addedNextDay ? dateTime : dateTime.add({ days: 1 })
  ) {
    addedNextDay = false;
    for (let hour = startHour; hour <= startHour + hourRange; hour++) {
      if (hour > 23 && !addedNextDay) {
        dateTime = dateTime.add({ days: 1 });
        addedNextDay = true;
      }

      times.push(
        dateTime.with({ hour: hour % 24, minute: 0 }),
        dateTime.with({ hour: hour % 24, minute: 15 }),
        dateTime.with({ hour: hour % 24, minute: 30 }),
        dateTime.with({ hour: hour % 24, minute: 45 }),
      );
    }
  }

  return times;
};
