import useCalculateTable from "@/app/_hooks/useCalculateTable";
import TableSkeleton from "@/components/table-skeleton";
import { Toggle } from "@/components/ui/toggle";
import { palette, times, type Mode } from "@/consts/availability-grid";
import useOfficerTimes from "@/hooks/useOfficerTimes";
import { cn } from "@/lib/utils";
import { type AvailabilityMap } from "@/lib/z.schema";
import { flip, offset, shift, useFloating } from "@floating-ui/react-dom";
import { Temporal } from "@js-temporal/polyfill";
import { useSession } from "next-auth/react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type SetStateAction,
} from "react";

interface AvailabilityViewerProps {
  userTimezone: string;
}

type SessionTime = {
  gridTime: string;
  selectedAt: string;
};

export default function OfficersGrid({
  userTimezone,
}: AvailabilityViewerProps) {
  const { data: session } = useSession();
  if (!session?.user.name) return null;
  const userId = session.user.id;

  const table = useCalculateTable(userTimezone);
  const {
    data,
    isDataFetched,
    isDataFetching,
    isDataLoading,
    isMutateLoading,
    mutate,
  } = useOfficerTimes();

  /**
   * Map officer.id to color
   */
  const officersColorMap = useMemo(() => {
    const map = new Map<string, string>();
    data?.officers.forEach((officer) => {
      const color = palette[Math.floor(Math.random() * palette.length)]!;
      map.set(officer.id, color);
    });
    return map;
  }, [data?.officers.length]);

  const [officersToFilter, setOfficersToFilter] = useState<string[]>([]);
  const [tempFocus, setTempFocus] = useState<string>(); // focus on a single officer in the grid

  // Reselect everyone if # of officers changes
  useEffect(() => {
    setOfficersToFilter([]);
  }, [data?.officers.length]);

  const [tooltip, setTooltip] = useState<{
    anchor: HTMLDivElement;
    date: string;
    peopleHere: NonNullable<ReturnType<AvailabilityMap["get"]>>;
  }>();
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(6), flip(), shift()],
    elements: { reference: tooltip?.anchor },
  });

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([]);
  const [selecting, _setSelecting] = useState<string[]>([]);
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v;
    _setSelecting(v);
  }, []);

  const startPos = useRef({ x: 0, y: 0 });
  const mode = useRef<Mode>();

  const userColor = useMemo(
    () => officersColorMap.get(userId)!,
    [officersColorMap.size],
  );

  /**
   * For optimistic UI updates, keep track of the times changed in session
   */
  const [firstFetchDone, setFirstFetchDone] = useState(false);
  const [sessionTimes, setSessionTimes] = useState<SessionTime[]>([]);
  useEffect(() => {
    if (!isDataFetched) return;
    if (firstFetchDone) return;

    const userTimes: SessionTime[] = [];
    data?.availabilities.forEach((officers, gridTime) => {
      const userOfficer = officers.find((o) => o.id === userId);
      if (userOfficer) {
        userTimes.push({
          gridTime,
          selectedAt: userOfficer.selectedAt,
        });
      }
    });
    setFirstFetchDone(true);
    setSessionTimes([...userTimes]);
  }, [isDataFetched]);

  /**
   * Submit the selected times to the server.
   */
  const onSelected = (
    /**
     * The times to update
     */
    newTimes: string[],
    /**
     * Updated sessionTimes
     */
    newSessionTimes: SetStateAction<SessionTime[]>,
    selectMode: Mode,
  ) => {
    setSessionTimes(newSessionTimes);

    mutate({
      gridTimes: newTimes,
      selectedAt: Temporal.Now.zonedDateTimeISO("UTC").toString(),
      mode: selectMode,
    });
  };

  /**
   * Render columns
   */
  const gridCols = useMemo(
    () =>
      table?.columns.map((column, colIdx) => (
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
                  (colIdx === 0 || table.columns.at(colIdx - 1) === null) &&
                    "rounded-bl-sm rounded-tl-sm border-l-2",
                  (colIdx === table.columns.length - 1 ||
                    table.columns.at(colIdx + 1) === null) &&
                    "rounded-br-sm rounded-tr-sm border-r-2",
                )}
              >
                {column.cells.map((cell, cellIdx) => {
                  // last cell time is excluded
                  if (cellIdx === column.cells.length - 1) return null;

                  if (!cell)
                    return (
                      <div
                        className={cn(
                          "relative h-2.5 border-t-2 border-solid border-transparent text-right",
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
                  const peopleHere = (
                    data?.availabilities.get(cell.cellInUTC) ?? []
                  )
                    .filter(
                      // keep officers that are not filtered out and are in focus
                      (p) =>
                        !officersToFilter.includes(p.id) &&
                        (!tempFocus || (!!tempFocus && p.id === tempFocus)),
                    )
                    .sort((a, b) => {
                      const aSelectedAt = Temporal.ZonedDateTime.from(
                        a.selectedAt,
                      );
                      const bSelectedAt = Temporal.ZonedDateTime.from(
                        b.selectedAt,
                      );

                      return (
                        Temporal.ZonedDateTime.compare(
                          aSelectedAt,
                          bSelectedAt,
                        ) * -1
                      );
                    });

                  const isCellSelected =
                    (mode.current === "add" || mode.current === "remove") &&
                    selecting.includes(cell.cellInUTC);

                  const userHere = sessionTimes.find(
                    (sT) => sT.gridTime === cell.cellInUTC,
                  );

                  const firstOfficerColor = officersColorMap.get(
                    peopleHere[0]?.id ?? "",
                  );
                  const secondOfficerColor = officersColorMap.get(
                    peopleHere[1]?.id ?? "",
                  );
                  let backgroundColor: CSSProperties["backgroundColor"];
                  if (isCellSelected) {
                    if (mode.current === "add") {
                      // show user if adding
                      backgroundColor = userColor;
                    } else if (mode.current === "remove") {
                      if (peopleHere[0]?.id === userId) {
                        // show 2nd latest officer if removing userColor
                        backgroundColor = secondOfficerColor;
                      } else {
                        // show latest officer if removing elsewhere
                        backgroundColor = firstOfficerColor;
                      }
                    }
                  } else if (
                    (isDataFetching || isDataLoading || isMutateLoading) &&
                    !!userHere &&
                    (!!peopleHere[0] && peopleHere[0].id !== userId
                      ? Temporal.ZonedDateTime.compare(
                          Temporal.ZonedDateTime.from(userHere.selectedAt),
                          Temporal.ZonedDateTime.from(peopleHere[0].selectedAt),
                        ) === 1
                      : true) &&
                    !officersToFilter.includes(userId) &&
                    (!tempFocus || (!!tempFocus && userId === tempFocus))
                  ) {
                    // optimistic UI update
                    backgroundColor = userColor;
                  } else if (
                    !!peopleHere[0] &&
                    ((peopleHere[0].id === userId && !!userHere) ||
                      peopleHere[0].id !== userId)
                  ) {
                    // show latest person
                    backgroundColor = firstOfficerColor;
                  } else if (!!peopleHere[1]) {
                    // show 2nd latest person
                    backgroundColor = secondOfficerColor;
                  }

                  return (
                    <div
                      key={cellIdx}
                      className={cn(
                        "relative h-2.5 border-t-2 border-gray-400",
                        cell.minute !== 0 &&
                          cell.minute !== 30 &&
                          "border-t-transparent",
                        cell.minute === 30 && "[border-top-style:dotted]",
                      )}
                      style={{
                        backgroundColor,
                      }}
                      // Tooltip ----
                      onMouseEnter={(e) => {
                        setTooltip({
                          anchor: e.currentTarget,
                          date: cell.label,
                          peopleHere,
                        });
                      }}
                      onMouseLeave={() => setTooltip(undefined)}
                      // Editing availability ----
                      onPointerDown={(e) => {
                        e.preventDefault();
                        startPos.current = { x: colIdx, y: cellIdx };
                        mode.current = !!userHere ? "remove" : "add";
                        setSelecting([cell.cellInUTC]);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }}
                      onPointerUp={() => {
                        if (mode.current === "add") {
                          const newTimes = [...selectingRef.current];
                          const newSessionTimes = [
                            // update existing times in the selection
                            ...sessionTimes.map((sT) => {
                              if (selectingRef.current.includes(sT.gridTime)) {
                                return {
                                  gridTime: sT.gridTime,
                                  selectedAt:
                                    Temporal.Now.zonedDateTimeISO(
                                      "UTC",
                                    ).toString(),
                                };
                              }

                              return sT;
                            }),
                            // add new times in the selection
                            ...selectingRef.current
                              .filter(
                                (t) =>
                                  !sessionTimes.some((sT) => sT.gridTime === t),
                              )
                              .map((t) => ({
                                gridTime: t,
                                selectedAt:
                                  Temporal.Now.zonedDateTimeISO(
                                    "UTC",
                                  ).toString(),
                              })),
                          ];
                          onSelected(newTimes, newSessionTimes, mode.current);
                        } else if (mode.current === "remove") {
                          const newTimes = selectingRef.current.filter((t) =>
                            sessionTimes.some((sT) => sT.gridTime === t),
                          );
                          const newSessionTimes = sessionTimes.filter(
                            (t) => !selectingRef.current.includes(t.gridTime),
                          );
                          onSelected(newTimes, newSessionTimes, mode.current);
                        }

                        // reset selection
                        mode.current = undefined;
                        setSelecting([]);
                      }}
                      onPointerEnter={() => {
                        if (mode.current) {
                          const found = [];
                          for (
                            let cy = Math.min(startPos.current.y, cellIdx);
                            cy < Math.max(startPos.current.y, cellIdx) + 1;
                            cy++
                          ) {
                            for (
                              let cx = Math.min(startPos.current.x, colIdx);
                              cx < Math.max(startPos.current.x, colIdx) + 1;
                              cx++
                            ) {
                              found.push({ y: cy, x: cx });
                            }
                          }
                          const foundCell = found.flatMap((d) => {
                            const serialized =
                              table.columns[d.x]?.cells[d.y]?.cellInUTC;
                            if (serialized && times.includes(serialized)) {
                              return [serialized];
                            }
                            return [];
                          });
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
      )) ?? <TableSkeleton />,
    [
      officersColorMap.size,
      table?.columns.length,
      data?.availabilities,
      officersToFilter.length,
      tempFocus,
      sessionTimes.length,
      selecting.length,
    ],
  );

  return (
    <>
      {/* List of people */}
      {table && !!data?.officers.length && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {data.officers.map((officer) => (
            <Toggle
              variant={"outline"}
              className={cn("hover:bg-inherit", "h-7")}
              style={
                !officersToFilter.includes(officer.id)
                  ? {
                      backgroundColor: officersColorMap.get(officer.id),
                    }
                  : {
                      borderColor: "hsl(var(--primary))",
                    }
              }
              key={officer.id}
              onClick={() => {
                setTempFocus(undefined);
                if (!officersToFilter.includes(officer.id)) {
                  setOfficersToFilter((prev) => [...prev, officer.id]);
                } else {
                  setOfficersToFilter((prev) =>
                    prev.filter((p) => p !== officer.id),
                  );
                }
              }}
              onMouseOver={() => setTempFocus(officer.id)}
              onMouseOut={() => setTempFocus(undefined)}
            >
              {officer.name}
            </Toggle>
          ))}
        </div>
      )}

      <div className="relative mx-0 my-5 overflow-y-auto">
        <div className="overflow-x-auto">
          {/* The table */}
          <div className="inline-flex min-w-full items-end justify-center">
            <div className="sticky left-1.5 z-10 flex flex-col overflow-hidden pr-2.5 pt-[1em]">
              {table?.rows.map((row, i) => (
                <div className="relative h-2.5 text-right" key={i}>
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
            {gridCols}
          </div>

          {/* Floating tooltip */}
          {tooltip && (
            <div
              className="absolute z-10 w-fit rounded-sm border-[1px] border-primary bg-background px-2 py-1"
              ref={refs.setFloating}
              style={floatingStyles}
            >
              <span className="block text-xs font-semibold opacity-80">
                {tooltip.date}
              </span>
              {officersToFilter.length !== data?.officers.length && (
                <div className="px-0 py-1 text-xs">
                  {tooltip.peopleHere.map((person) => (
                    <span
                      className={cn(
                        `m-0.5 inline-block rounded-sm border-[1px] px-1 py-[1px]`,
                      )}
                      key={person.id}
                      style={{
                        borderColor: officersColorMap.get(person.id),
                      }}
                    >
                      {person.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
