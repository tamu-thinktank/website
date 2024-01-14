import { times } from "@/consts/availability-grid";
import { calculateTable } from "@/lib/utils/availability-grid/calculateTable";
import { useEffect, useRef, useState } from "react";

/**
 * Calculate the table using a web worker if possible
 */
export default function useCalculateTable(userTimezone: string) {
  const tableWorker = useRef<Worker>();
  const [table, setTable] = useState<ReturnType<typeof calculateTable>>();

  useEffect(() => {
    if (times.length > 0) {
      if (!tableWorker.current) {
        tableWorker.current = window.Worker
          ? new Worker(new URL("src/workers/calculateTable", import.meta.url))
          : undefined;
      }

      if (tableWorker.current) {
        tableWorker.current.onmessage = (
          e: MessageEvent<ReturnType<typeof calculateTable>>,
        ) => setTable(e.data);
        tableWorker.current.postMessage(userTimezone);
        setTable(undefined);
      } else {
        setTable(calculateTable(userTimezone));
      }
    }
  }, [userTimezone]);

  return table;
}
