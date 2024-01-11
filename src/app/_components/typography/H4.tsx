import type { PropsWithChildren } from "react";

export function H4({ children }: PropsWithChildren) {
  return (
    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}
