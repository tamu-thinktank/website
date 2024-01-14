"use client";

import { type toast } from "@/app/_components/ui/use-toast";
import { type AppRouter } from "@/server/api/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  loggerLink,
  unstable_httpBatchStreamLink,
  type TRPCClientErrorLike,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { type toast as sonner } from "sonner";
import { getUrl, transformer } from "./shared";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
            };
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
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
