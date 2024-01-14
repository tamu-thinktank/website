import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalize first letter of string or array of strings
 */
export function capitalizeFirstLetter(str: string | string[] | undefined) {
  if (str === undefined) return str;

  if (Array.isArray(str)) {
    return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
