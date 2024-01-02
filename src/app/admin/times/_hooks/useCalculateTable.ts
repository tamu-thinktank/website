import { calculateTable, type CalculateTableArgs } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { expandedTimes } from "../_consts";

/**
 * Calculate the table using a web worker if possible
 */
export default function useCalculateTable(userTimezone: string) {
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

  return table;
}
