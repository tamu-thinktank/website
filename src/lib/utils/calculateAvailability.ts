import { type PersonResponse } from "../z.schema";
import { convertTimesToDates } from "./convertTimesToDates";

/**
 * Map of UTC date strings to people who are available at that time.
 */
type AvailabilityMap = Map<
  string,
  {
    name: string;
    color: string;
  }[]
>;

/**
 * Takes an array of UTC dates and an array of people,
 * where each person has a name and availability array (UTC), and returns the group availability for each date passed in.
 */
export const calculateAvailability = (
  times: string[],
  people: PersonResponse[],
): AvailabilityMap => {
  const peopleDates = people.map((p) => ({
    name: p.name,
    dates: convertTimesToDates(p.availability),
    color: p.color,
  }));

  const availabilities: AvailabilityMap = new Map();

  times.forEach((utcTimeString) => {
    const utcTime = convertTimesToDates([utcTimeString])[0]!;
    const peopleHere = peopleDates.flatMap((person) => {
      if (person.dates.some((date) => date.equals(utcTime))) {
        return [
          {
            name: person.name,
            color: person.color,
          },
        ];
      }

      return [];
    });

    availabilities.set(utcTime.toString(), peopleHere);
  });

  return availabilities;
};
