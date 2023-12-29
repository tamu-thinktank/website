import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";

export default function PurpleLayout({
  children,
  className,
}: ComponentPropsWithoutRef<"main">) {
  return (
    <main
      className={cn(
        `flex h-screen items-center justify-center bg-gradient-to-r from-[#2e026d] to-[#15162c]`,
        className,
      )}
    >
      {children}
    </main>
  );
}
