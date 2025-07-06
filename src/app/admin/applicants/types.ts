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

export interface SubTeamPreference {
  name: string;
  interest: string;
}

export interface PositionPreference {
  position: string;
  interest: string;
}

export interface ResearchInterest {
  area: string;
  interest: string;
}

export interface ApplicationStatus {
  stat: string;
}

export interface ApplicantData {
  id: string;
  name: string;
  interests: ResearchInterest[];
  teamRankings: string[];
  major: string;
  year: string;
  rating: string;
  category: string;
  status: string;
  officerpos: PositionPreference[];
  subTeam: SubTeamPreference[];
}

export interface FilterState {
  team: string;
  rating: string;
  interests: string;
  major: string;
  position: string;
  status: string;
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
