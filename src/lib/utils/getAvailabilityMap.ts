import { type dbAvailabilitiesType } from "@/server/db/queries";
import { type AvailabilityMap } from "../z.schema";

export const getAvailabilityMap = (dbAvailabilities: dbAvailabilitiesType) => {
  const availabilities: AvailabilityMap = new Map();

  dbAvailabilities.forEach(({ gridTime, officer, selectedAt }) => {
    const officerHere = {
      ...officer,
      selectedAt,
    };

    const officersHere = availabilities.get(gridTime);
    if (officersHere) {
      officersHere.push(officerHere);
    } else {
      availabilities.set(gridTime, [officerHere]);
    }
  });

  return availabilities;
};
