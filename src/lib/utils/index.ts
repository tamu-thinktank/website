import { type toast } from "@/app/_components/ui/use-toast";
import { type AppRouter } from "@/server/api/root";
import { type TRPCClientErrorLike } from "@trpc/client";
import { clsx, type ClassValue } from "clsx";
import { type toast as sonner } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * trpc client error handler
 */
export function clientErrorHandler(
  props: {
    err: TRPCClientErrorLike<AppRouter>;
  } & ({ toastFn: typeof toast } | { sonnerFn: typeof sonner }),
) {
  const msgContent = props.err.data?.zodError?.fieldErrors.content;
  if ("toastFn" in props) {
    props.toastFn({
      title: "Error",
      variant: "destructive",
      description: msgContent?.[0] ? msgContent[0] : props.err.message,
      duration: 5000,
    });
  } else if ("sonnerFn" in props) {
    props.sonnerFn.error("Error", {
      description: msgContent?.[0] ? msgContent[0] : props.err.message,
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
