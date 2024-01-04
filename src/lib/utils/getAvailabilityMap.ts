import { type dbAvailabilitiesType } from "@/server/db/queries";
import { type AvailabilityMap } from "../z.schema";

export const getAvailabilityMap = (dbAvailabilities: dbAvailabilitiesType) => {
  const availabilities: AvailabilityMap = new Map();

  dbAvailabilities.forEach(({ gridTime, officer, selectedAt }) => {
    const newOfficerHere = {
      ...officer,
      selectedAt,
    };

    const officersHere = availabilities.get(gridTime);
    if (officersHere) {
      officersHere.push(newOfficerHere);
    } else {
      availabilities.set(gridTime, [newOfficerHere]);
    }
  });

  return availabilities;
};
