import { type dbAvailabilitiesType } from "@/server/db/queries";
import { Temporal } from "@js-temporal/polyfill";
import { type AvailabilityMap } from "../../validations/apply";

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
      officersHere.sort((a, b) => {
        const aTemp = Temporal.ZonedDateTime.from(a.selectedAt);
        const bTemp = Temporal.ZonedDateTime.from(b.selectedAt);

        return Temporal.ZonedDateTime.compare(aTemp, bTemp) * -1;
      });
    } else {
      availabilities.set(gridTime, [officerHere]);
    }
  });

  return availabilities;
};
