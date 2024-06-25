import type { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-12 xl:px-6">{children}</div>
  );
}
