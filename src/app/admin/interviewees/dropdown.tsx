import * as React from "react";
import type { DropdownProps } from "./intervieweetypes";

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="relative w-[300px]">
      <div
        onClick={onToggle}
        className="m-0 my-auto flex flex-1 cursor-pointer items-center justify-center rounded-[48px] border border-solid border-neutral-200 px-6 py-3 text-center"
      >
        <span className="text-sm">{value || "Select"}</span>
        <span className="ml-1.5 text-xs">▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-800 text-sm">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                onToggle();
              }}
              className="cursor-pointer px-4 py-2 hover:bg-neutral-700"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
