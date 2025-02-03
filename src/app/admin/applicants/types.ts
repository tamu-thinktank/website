export interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  options?: string[];
  onOptionSelect?: (option: string) => void;
}

export interface TableHeaderProps {
  headers: string[];
}

export interface ApplicantData {
  name: string;
  interests: string[];
  teamRankings: string[];
  major: string;
  year: string;
  rating: string;
  category: string;
}

export interface FilterState {
  team: string;
  rating: string;
  interests: string;
  major: string;
}

export interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  options?: string[];
  onOptionSelect?: (option: string) => void;
  selected?: string;
}