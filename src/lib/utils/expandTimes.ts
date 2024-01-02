import { type TimeRange } from "@/types";
import { Temporal } from "@js-temporal/polyfill";
import { convertTimesToDates } from ".";

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

      const hourAsString = (hour % 24).toString().padStart(2, "0");
      const dayAsString = dateTime.day.toString().padStart(2, "0");
      const monthAsString = dateTime.month.toString().padStart(2, "0");
      const yearAsString = dateTime.year.toString().padStart(4, "0");
      const timeAsString = (minute: string) =>
        `${hourAsString}${minute}-${dayAsString}${monthAsString}${yearAsString}`;

      times.push(
        timeAsString("00"),
        timeAsString("15"),
        timeAsString("30"),
        timeAsString("45"),
      );
    }
  }

  return times;
};
