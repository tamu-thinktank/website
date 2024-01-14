"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Next13ProgressBar } from "next13-progressbar";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <>
      <Next13ProgressBar
        height="4px"
        color="#95bed4"
        options={{ showSpinner: false }}
        showOnShallow
      />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
};
