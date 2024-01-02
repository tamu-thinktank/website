import { type PersonResponse } from "../z.schema";

/**
 * Map of UTC date strings to people who are available at that time.
 */
export type AvailabilityMap = Map<
  string,
  {
    name: string;
    color: string;
  }[]
>;

/**
 * Takes an array of UTC dates and an array of people,
 * where each person has a name and availability array (UTC), and returns the availability for each date passed in.
 * `HHmm-DDMMYYYY` format in UTC for the map keys.
 */
export const calculateAvailability = (
  /**
   * Times of table in UTC (`HHmm-DDMMYYYY` format)
   */
  times: string[],
  people: PersonResponse[],
): AvailabilityMap => {
  const availabilities: AvailabilityMap = new Map();

  times.forEach((utcTime) => {
    const peopleHere = people.flatMap((person) => {
      if (person.availability.some((date) => date === utcTime)) {
        return [
          {
            name: person.name,
            color: person.color,
          },
        ];
      }

      return [];
    });

    availabilities.set(utcTime, peopleHere);
  });

  return availabilities;
};
