import { cn } from "@/lib/utils";

export default function GridSkeleton() {
  return (
    <div className="opacity-50">
      <div className={cn("flex justify-around", "mb-[3px] text-xs")}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="block h-[0.9em] w-[5ch] rounded-[0.2em] bg-current"
          />
        ))}
      </div>

      <div className={"flex justify-around"}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="block h-[0.9em] w-[3ch] rounded-[0.2em] bg-current"
          />
        ))}
      </div>
      <div className="relative mb-2.5 mt-0.5 h-96 w-80 rounded-[3px] border-2 border-current" />
    </div>
  );
}
