"use client";

import * as React from "react";

interface FilterButtonProps {
  label: string;
  options: string[];
  selected: string;
  onOptionSelect: (option: string) => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  label: _label,
  options,
  selected,
  onOptionSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-3 transition-colors hover:bg-stone-800"
      >
        <span>{selected}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full min-w-[150px] rounded-lg border border-solid border-neutral-700 bg-neutral-900 py-2 shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              className="cursor-pointer px-4 py-2 text-left hover:bg-neutral-800"
              onClick={() => {
                onOptionSelect(option === "Reset" ? "" : option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
