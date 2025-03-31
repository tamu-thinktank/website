import * as React from 'react';
import { DropdownProps } from './types';

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
        className="flex flex-1 justify-center items-center px-6 py-3 m-0 my-auto text-center border border-solid cursor-pointer rounded-[48px] border-neutral-200"
      >
        <span className="text-sm">{value || 'Select'}</span>
        <span className="text-xs ml-1.5">▼</span>
      </div>
      {isOpen && (
        <div className="max-h-[200px] overflow-y-auto w-full absolute text-sm z-50 w-full mt-1 bg-neutral-800 border border-neutral-200 rounded-lg">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                onToggle();
              }}
              className="px-4 py-2 hover:bg-neutral-700 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};