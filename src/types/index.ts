/**
 * Removes undefined from a type.
 */
export type NoUndefined<T> = T extends undefined ? never : T;
