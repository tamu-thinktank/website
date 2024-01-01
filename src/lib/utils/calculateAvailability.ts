import { type Temporal } from "@js-temporal/polyfill";
import { type PersonResponse } from "../z.schema";
import { convertTimesToDates } from "./convertTimesToDates";

/**
 * Takes an array of UTC dates and an array of people,
 * where each person has a name and availability array (UTC), and returns the group availability for each date passed in.
 */
export const calculateAvailability = (
  times: Temporal.ZonedDateTime[],
  people: PersonResponse[],
) => {
  const peopleDates = people.map((p) => ({
    name: p.name,
    dates: convertTimesToDates(p.availability),
    color: p.color,
  }));

  const availabilities = new Map<
    string,
    {
      name: string;
      color: string;
    }[]
  >();

  times.forEach((utcTime) => {
    const peopleHere = peopleDates.flatMap((person) => {
      return person.dates.some((date) => date.equals(utcTime))
        ? [
            {
              name: person.name,
              color: person.color,
            },
          ]
        : [];
    });

    availabilities.set(utcTime.toString(), peopleHere);
  });

  return availabilities;
};
