import { Temporal } from "@js-temporal/polyfill";

type TimeRange = {
  /** DateTime at beginning of table in UTC */
  startDateTime: Temporal.ZonedDateTime;
  /** DateTime at end of table in UTC */
  endDateTime: Temporal.ZonedDateTime;
};

/**
 * Takes timeRange and its timezone and as adds 15, 30 and 45 minute variants for every hour in every day
 */
export const expandTimes = ({ startDateTime, endDateTime }: TimeRange) => {
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
        dateTime.with({ hour: hour % 24, minute: 0 }).toString(),
        dateTime.with({ hour: hour % 24, minute: 15 }).toString(),
        dateTime.with({ hour: hour % 24, minute: 30 }).toString(),
        dateTime.with({ hour: hour % 24, minute: 45 }).toString(),
      );
    }
  }

  return times;
};
