import { calculateTable, type CalculateTableArgs } from "src/lib/utils";

self.onmessage = (e: MessageEvent<CalculateTableArgs>) => {
  self.postMessage(calculateTable(e.data));
};
