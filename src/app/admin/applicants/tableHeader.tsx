import * as React from 'react';
import type { TableHeaderProps } from './types';

export const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <div className="flex overflow-hidden flex-col px-px pt-3 w-full bg-white bg-opacity-10 rounded-[47px_47px_0px_0px] text-neutral-200 max-md:max-w-full">
      <div className="text-sm flex gap-10 justify-center w-full max-w-full">
        {headers.map((header, index) => (
          <div key={index} className="flex-1 text-center">
            {header}
          </div>
        ))}
      </div>
      <div className="shrink-0 mt-2.5 h-px border border-solid border-neutral-200 max-md:max-w-full" />
    </div>
  );
};