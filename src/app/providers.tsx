"use client";

import { SessionProvider } from "next-auth/react";
import { Next13ProgressBar } from "next13-progressbar";
import { ThemeProvider } from "@/components/theme-provider";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <Next13ProgressBar
        height="4px"
        color="#95bed4"
        options={{ showSpinner: false }}
        showOnShallow
      />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};
