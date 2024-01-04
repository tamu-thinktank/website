import { calculateTable } from "src/lib/utils/calculateTable";

self.onmessage = (e: MessageEvent<string>) => {
  self.postMessage(calculateTable(e.data));
};
