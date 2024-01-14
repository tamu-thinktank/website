import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";

export default function PurpleLayout({
  children,
  className,
}: ComponentPropsWithoutRef<"main">) {
  return (
    <main
      className={cn(
        `flex h-screen items-center justify-center bg-gradient-to-r from-[#06686D] to-[#083763]`,
        className,
      )}
    >
      {children}
    </main>
  );
}
