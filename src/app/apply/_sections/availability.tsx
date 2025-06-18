import GridSkeleton from "@/components/grid-skeleton";
import PickTimezone from "@/components/pick-timezone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, FormMessage } from "@/components/ui/form";
import type { Mode } from "@/consts/availability-grid";
import { palette, times } from "@/consts/availability-grid";
import type useCalculateTable from "@/hooks/useCalculateTable";
import type { RouterInputs } from "@/lib/trpc/shared";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import { Fragment, useCallback, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

interface AvailabilityProps {
  userTimezone: string;
  setUserTimezone: (timezone: string) => void;
  table: ReturnType<typeof useCalculateTable>;
}
export default function Availability({
  userTimezone,
  setUserTimezone,
  table,
}: AvailabilityProps) {
  const form = useFormContext<RouterInputs["dcmember"]["DCMemberApplyForm"]>();
  const color = "#137522";

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([]);
  const [selecting, _setSelecting] = useState<string[]>([]);
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v;
    _setSelecting(v);
  }, []);

  const startPos = useRef({ x: 0, y: 0 });
  const mode = useRef<Mode>();

  const onSelected = (
    /**
     * Updated times
     */
    newTimes: string[],
  ) => {
    form.setValue("meetingTimes", newTimes);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Interview times</CardTitle>
          <CardDescription>
            Select times you're available for an interview. If this application
            is accepted, we'll pick one of your selected times based on our
            availability and let you know about the interview.
          </CardDescription>
        </CardHeader>
      </Card>
      <FormField
        control={form.control}
        name="meetingTimes"
        render={() => (
          <>
            <Card>
              <CardContent className="mt-6 flex flex-col gap-1">
                <PickTimezone
                  userTimezone={userTimezone}
                  setUserTimezone={setUserTimezone}
                />
              </CardContent>
              <CardContent>
                <div className="">
                  <div className="overflow-x-auto">
                    {/* The table */}
                    <div className="inline-flex items-end justify-center">
                      <div className="sticky left-0 z-10 flex flex-col overflow-hidden px-1.5 pt-[1em]">
                        {table?.rows.map((row, i) => (
                          <div className="h-2.5 text-right" key={i}>
                            {row && (
                              <label
                                className="inline-block whitespace-nowrap rounded-[0.3em] bg-background px-[0.2em] py-[0.1em] text-xs
                          [transform:translateY(-85%)]"
                              >
                                {row.label}
                              </label>
                            )}
                          </div>
                        )) ?? null}
                      </div>
                      {table?.columns.map((column, colIdx) => (
                        <Fragment key={colIdx}>
                          {column ? (
                            <div className="mb-2.5 flex w-[60px] flex-col">
                              <label className="text-center text-xs">
                                {column.header.dateLabel}
                              </label>
                              <label className="text-center text-sm">
                                {column.header.weekdayLabel}
                              </label>

                              <div
                                className={cn(
                                  "flex flex-col border-b-2 border-l-[1px] border-r-[1px] border-primary",
                                  (colIdx === 0 ||
                                    table.columns.at(colIdx - 1) === null) &&
                                    "rounded-bl-sm rounded-tl-sm border-l-2",
                                  (colIdx === table.columns.length - 1 ||
                                    table.columns.at(colIdx + 1) === null) &&
                                    "rounded-br-sm rounded-tr-sm border-r-2",
                                )}
                              >
                                {column.cells.map((cell, cellIdx) => {
                                  // last cell time is excluded
                                  if (cellIdx === column.cells.length - 1)
                                    return null;

                                  if (!cell)
                                    return (
                                      <div
                                        className={cn(
                                          "h-2.5 border-t-2 border-solid border-transparent text-right",
                                          "bg-origin-border",
                                        )}
                                        key={cellIdx}
                                        style={{
                                          backgroundImage:
                                            "repeating-linear-gradient(45deg, transparent, transparent 4.3px, #374151 4.3px, #374151 8.6px)",
                                        }}
                                      />
                                    );

                                  /**
                                   * People who are available at this time, sorted by selectedAt in descending order
                                   */
                                  const isCellSelected =
                                    (mode.current === "add" ||
                                      mode.current === "remove") &&
                                    selecting.includes(cell.cellInUTC);

                                  const userHere = form
                                    .getValues("meetingTimes")
                                    .includes(cell.cellInUTC);

                                  let backgroundColor: CSSProperties["backgroundColor"];
                                  if (isCellSelected) {
                                    if (mode.current === "add") {
                                      backgroundColor = color;
                                    } else if (mode.current === "remove") {
                                      backgroundColor = "transparent";
                                    }
                                  } else if (userHere) {
                                    backgroundColor = color;
                                  }

                                  return (
                                    <div
                                      key={cellIdx}
                                      className={cn(
                                        "h-2.5 border-t-2 border-gray-400",
                                        cell.minute !== 0 &&
                                          cell.minute !== 30 &&
                                          "border-t-transparent",
                                        cell.minute === 30 &&
                                          "[border-top-style:dotted]",
                                      )}
                                      style={{
                                        backgroundColor,
                                      }}
                                      // Editing availability ----
                                      onPointerDown={(e) => {
                                        e.preventDefault();
                                        startPos.current = {
                                          x: colIdx,
                                          y: cellIdx,
                                        };
                                        mode.current = userHere
                                          ? "remove"
                                          : "add";
                                        setSelecting([cell.cellInUTC]);
                                        e.currentTarget.releasePointerCapture(
                                          e.pointerId,
                                        );
                                      }}
                                      onPointerUp={() => {
                                        if (mode.current === "add") {
                                          const newTimes = [
                                            ...form.getValues("meetingTimes"),
                                            ...selectingRef.current.filter(
                                              (t) =>
                                                !form
                                                  .getValues("meetingTimes")
                                                  .includes(t),
                                            ),
                                          ];
                                          onSelected(newTimes);
                                        } else if (mode.current === "remove") {
                                          const newTimes = form
                                            .getValues("meetingTimes")
                                            .filter(
                                              (t) =>
                                                !selectingRef.current.includes(
                                                  t,
                                                ),
                                            );
                                          onSelected(newTimes);
                                        }

                                        // reset selection
                                        mode.current = undefined;
                                        setSelecting([]);
                                      }}
                                      onPointerEnter={() => {
                                        if (mode.current) {
                                          const found = [];
                                          for (
                                            let cy = Math.min(
                                              startPos.current.y,
                                              cellIdx,
                                            );
                                            cy <
                                            Math.max(
                                              startPos.current.y,
                                              cellIdx,
                                            ) +
                                              1;
                                            cy++
                                          ) {
                                            for (
                                              let cx = Math.min(
                                                startPos.current.x,
                                                colIdx,
                                              );
                                              cx <
                                              Math.max(
                                                startPos.current.x,
                                                colIdx,
                                              ) +
                                                1;
                                              cx++
                                            ) {
                                              found.push({ y: cy, x: cx });
                                            }
                                          }
                                          const foundCell = found.flatMap(
                                            (d) => {
                                              const serialized =
                                                table.columns[d.x]?.cells[d.y]
                                                  ?.cellInUTC;
                                              if (
                                                serialized &&
                                                times.includes(serialized)
                                              ) {
                                                return [serialized];
                                              }
                                              return [];
                                            },
                                          );
                                          setSelecting(foundCell);
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="w-3" />
                          )}
                        </Fragment>
                      )) ?? <GridSkeleton />}
                    </div>
                  </div>
                </div>
                <FormMessage />
              </CardContent>
            </Card>
          </>
        )}
      />
    </div>
  );
}
