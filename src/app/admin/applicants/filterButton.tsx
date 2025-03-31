import * as React from 'react';
import { Dropdown } from './dropdown';
import { FilterButtonProps } from './types';

export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  options = [],
  onOptionSelect,
  selected = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (value: string) => {
    if (value === 'Reset') {
      onOptionSelect?.('');
    }
    else {
      onOptionSelect?.(value);
    }
    setIsOpen(false);
  };

  return (
    <Dropdown
      options={options}
      value={selected || label}
      onChange={handleChange}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    />
  );
};