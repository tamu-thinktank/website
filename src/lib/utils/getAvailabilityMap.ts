import { type dbAvailabilitiesType } from "@/server/db/queries";
import { type AvailabilityMap } from "../z.schema";

export const getAvailabilityMap = (dbAvailabilities: dbAvailabilitiesType) => {
  const availabilities: AvailabilityMap = new Map();

  dbAvailabilities.forEach(({ gridTime, officer, selectedAt }) => {
    const newOfficerHere = {
      ...officer,
      selectedAt,
    };
    const officersHere = availabilities.has(gridTime)
      ? availabilities.get(gridTime)!
      : [];

    availabilities.set(gridTime, [...officersHere, newOfficerHere]);
  });

  return availabilities;
};
