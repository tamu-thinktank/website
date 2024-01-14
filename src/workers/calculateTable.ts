import { calculateTable } from "@/lib/utils/availability-grid/calculateTable";

self.onmessage = (e: MessageEvent<string>) => {
  self.postMessage(calculateTable(e.data));
};
