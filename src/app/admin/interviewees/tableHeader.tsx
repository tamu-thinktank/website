import type * as React from "react";

interface TableHeaderProps {
  headers: string[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <div className="flex w-full items-center justify-center gap-10 bg-neutral-900 px-5 py-4 text-sm font-medium tracking-wide text-neutral-200 max-md:flex-wrap max-md:px-5">
      {headers.map((header, index) => (
        <div key={index} className="flex-1 text-center">
          {header}
        </div>
      ))}
    </div>
  );
};
