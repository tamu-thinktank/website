import { type TimeRange } from "@/types";
import { Temporal } from "@js-temporal/polyfill";
import { convertTimesToDates } from ".";
import { serializeTime } from "./serializeTime";

/**
 * Takes timeRange and its timezone and as adds 15, 30 and 45 minute variants for every hour in every day, converted to UTC
 */
export const expandTimes = (timeRange: TimeRange, currTimezone: string) => {
  const [startDateTime, endDateTime] = [
    convertTimesToDates([timeRange.startDateTime], currTimezone, "UTC")[0]!,
    convertTimesToDates([timeRange.endDateTime], currTimezone, "UTC")[0]!,
  ];
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
        serializeTime(dateTime.with({ hour: hour % 24, minute: 0 })),
        serializeTime(dateTime.with({ hour: hour % 24, minute: 15 })),
        serializeTime(dateTime.with({ hour: hour % 24, minute: 30 })),
        serializeTime(dateTime.with({ hour: hour % 24, minute: 45 })),
      );
    }
  }

  return times;
};
