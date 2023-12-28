import { type toast } from "@/app/_components/ui/use-toast";
import { type RouterInputs } from "@/lib/trpc/shared";
import { type AppRouter } from "@/server/api/root";
import { type TRPCClientErrorLike } from "@trpc/client";
import { clsx, type ClassValue } from "clsx";
import { type FieldPath } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

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
