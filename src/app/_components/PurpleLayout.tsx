import type { HTMLAttributes } from "react";

/**
 * background for solo, floating components on the page
 */
export default function PurpleLayout({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`flex min-h-screen items-center justify-center bg-gradient-to-r from-[#2e026d] to-[#15162c]`}>
      {children}
    </div>
  );
}
