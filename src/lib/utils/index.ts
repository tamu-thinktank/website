import { type toast } from "@/app/_components/ui/use-toast";
import { type AppRouter } from "@/server/api/root";
import { type TRPCClientErrorLike } from "@trpc/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * trpc client error handler
 */
export function clientErrorHandler(
  err: TRPCClientErrorLike<AppRouter>,
  toastFn: typeof toast,
) {
  if (err.data?.zodError) {
    const msgContent = err.data.zodError.fieldErrors.content;
    if (msgContent?.[0])
      toastFn({
        title: "Error",
        description: msgContent[0],
        duration: 5000,
      });
  } else {
    toastFn({
      title: "Error",
      description: err.message,
      duration: 5000,
    });
  }
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

export * from "./allowUrlToWrap";
export * from "./calculateAvailability";
export * from "./calculateColumns";
export * from "./calculateRows";
export * from "./calculateTable";
export * from "./convertTimesToDates";
export * from "./detectBrowser";
export * from "./expandTimes";
export * from "./getWeekdayNames";
export * from "./makeClass";
export * from "./relativeTimeFormat";
export * from "./serializeTime";
export * from "./unhyphenate";
