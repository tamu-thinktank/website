import * as React from "react";
import type { TableHeaderProps } from "./types";

export const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[47px_47px_0px_0px] bg-white bg-opacity-10 px-px pt-3 text-neutral-200 max-md:max-w-full">
      <div className="flex w-full max-w-full justify-center gap-10 text-sm">
        {headers.map((header, index) => (
          <div key={index} className="flex-1 text-center">
            {header}
          </div>
        ))}
      </div>
      <div className="mt-2.5 h-px shrink-0 border border-solid border-neutral-200 max-md:max-w-full" />
    </div>
  );
};
