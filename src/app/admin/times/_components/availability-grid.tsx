import { Toggle } from "@/components/ui/toggle";
import {
  calculateAvailability,
  calculateTable,
  cn,
  type CalculateTableArgs,
} from "@/lib/utils";
import { fakePeopleTimes } from "@/mocks/peopleTimes";
import { flip, offset, shift, useFloating } from "@floating-ui/react-dom";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { expandedTimes } from "../_consts";
import Skeleton from "./table-skeleton";

interface AvailabilityViewerProps {
  userTimezone: string;
}

export default function AvailabilityGrid({
  userTimezone,
}: AvailabilityViewerProps) {
  const [tempFocus, setTempFocus] = useState<string>(); // focus on a single person in list

  const people = useMemo(() => fakePeopleTimes(), []);
  const [peopleToFilter, setPeopleToFilter] = useState<string[]>([]);
  const filteredPeople = useMemo(
    () =>
      people
        .map((p) => ({
          name: p.name,
          color: p.color,
        }))
        .filter((p) => !peopleToFilter.includes(p.name)),
    [people, peopleToFilter],
  );
  // Reselect everyone if the amount of people changes
  useEffect(() => {
    setPeopleToFilter([]);
  }, [people.length]);

  const [tooltip, setTooltip] = useState<{
    anchor: HTMLDivElement;
    date: string;
    peopleHere: {
      name: string;
      color: string;
    }[];
  }>();
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(6), flip(), shift()],
    elements: { reference: tooltip?.anchor },
  });

  // calculate table in a web worker if possible
  const tableWorker = useRef<Worker>();
  const [table, setTable] = useState<ReturnType<typeof calculateTable>>();
  useEffect(() => {
    if (expandedTimes.length > 0) {
      if (!tableWorker.current) {
        tableWorker.current = window.Worker
          ? new Worker(new URL("src/workers/calculateTable", import.meta.url))
          : undefined;
      }

      const args = {
        times: expandedTimes,
        timezone: userTimezone,
      } satisfies CalculateTableArgs;
      if (tableWorker.current) {
        tableWorker.current.onmessage = (
          e: MessageEvent<ReturnType<typeof calculateTable>>,
        ) => setTable(e.data);
        tableWorker.current.postMessage(args);
        setTable(undefined);
      } else {
        setTable(calculateTable(args));
      }
    }
  }, [userTimezone]);

  const availabilities = useMemo(
    () => calculateAvailability(expandedTimes, people),
    [people],
  );

  const grid = useMemo(
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

                  let peopleHere = (
                    availabilities.get(cell.cellInUTC) ?? []
                  ).filter((p) => !peopleToFilter.includes(p.name));
                  if (tempFocus) {
                    peopleHere = peopleHere.filter((p) => p.name === tempFocus);
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
                        backgroundColor: peopleHere[0]
                          ? peopleHere[0].color
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        setTooltip({
                          anchor: e.currentTarget,
                          date: cell.label,
                          peopleHere: peopleHere,
                        });
                      }}
                      onMouseLeave={() => setTooltip(undefined)}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-3" />
          )}
        </Fragment>
      )) ?? <Skeleton />,
    [availabilities, table?.columns, tempFocus, peopleToFilter],
  );

  return (
    <>
      {/* List of people */}
      {table && people.length > 1 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {people.map((person) => (
            <Toggle
              variant={"outline"}
              className={cn("hover:bg-inherit", "h-7")}
              style={
                filteredPeople.some((fp) => fp.name === person.name)
                  ? {
                      backgroundColor: person.color,
                    }
                  : {
                      borderColor: "hsl(var(--primary))",
                    }
              }
              key={person.name}
              onClick={() => {
                setTempFocus(undefined);
                if (!peopleToFilter.includes(person.name)) {
                  setPeopleToFilter((prev) => [...prev, person.name]);
                } else {
                  setPeopleToFilter((prev) =>
                    prev.filter((p) => p !== person.name),
                  );
                }
              }}
              onMouseOver={() => setTempFocus(person.name)}
              onMouseOut={() => setTempFocus(undefined)}
            >
              {person.name}
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
            {grid}
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
              {!!filteredPeople.length && (
                <div className="px-0 py-1 text-xs">
                  {tooltip.peopleHere.map((person) => (
                    <span
                      className={cn(
                        `m-0.5 inline-block rounded-sm border-[1px] px-1 py-[1px]`,
                      )}
                      key={person.name}
                      style={{
                        borderColor: person.color,
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
