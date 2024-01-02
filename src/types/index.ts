export type TimeRange = {
  /** DateTime at beginning of table in CT, Format: HHmm-ddMMyyyy */
  startDateTime: string;
  /** DateTime at end of table in CT, Format: HHmm-ddMMyyyy */
  endDateTime: string;
};

/**
 * Removes undefined from a type.
 */
export type NoUndefined<T> = T extends undefined ? never : T;
