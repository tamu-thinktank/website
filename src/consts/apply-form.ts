import { Challenge, InterestLevel, ExperienceLevel, LearningInterestLevel } from "@prisma/client";

export const challenges: {
  id: Challenge;
  label: string;
  link: string;
}[] = [
    {
      id: Challenge.TSGC,
      label: "Texas Space Grant Consortium Design Challenge (TSGC)",
      link: "https://ig.utexas.edu/tsgc/design-challenge/",
    },
  ];

// Team and Research Area Types
interface Team {
  id: string;
  name: string;
  researchAreas: ResearchArea[];
}

interface ResearchArea {
  id: string;
  name: string;
  relatedTeams: string[];
}

// Hardcoded Teams and Research Areas
// Must run 'prisma db seed' to update the database with these values
export const TEAMS: Team[] = [
  {
    id: "TEAM_1",
    name: "Team 1",
    researchAreas: [
      {
        id: "AREA_1A",
        name: "Research Area 1A",
        relatedTeams: ["TEAM_1"]
      },
      {
        id: "AREA_1B",
        name: "Research Area 1B",
        relatedTeams: ["TEAM_1", "TEAM_2"]
      }
    ]
  },
  {
    id: "TEAM_2",
    name: "Team 2",
    researchAreas: [
      {
        id: "AREA_2A",
        name: "Research Area 2A",
        relatedTeams: ["TEAM_2"]
      },
      {
        id: "AREA_2B",
        name: "Research Area 2B",
        relatedTeams: ["TEAM_2"]
      }
    ]
  },
  {
    id: "TEAM_3",
    name: "Team 3",
    researchAreas: [
      {
        id: "AREA_3A",
        name: "Research Area 3A",
        relatedTeams: ["TEAM_3"]
      }
    ]
  }
];

// Flattened and deduplicated research areas
export const RESEARCH_AREAS: ResearchArea[] = Array.from(
  new Map(
    TEAMS.flatMap(team =>
      team.researchAreas.map(ra => ({
        ...ra,
        relatedTeams: [...new Set([...ra.relatedTeams, team.id])]
      }))
    ).map(ra => [ra.id, ra])
  ).values()
);

export const INTEREST_LEVELS = Object.values(InterestLevel).map((level) => ({
  value: level as InterestLevel,
  label: level.charAt(0) + level.slice(1).toLowerCase(),
}));

export const EXPERIENCE_LEVELS = Object.values(ExperienceLevel).map((level) => ({
  value: level as ExperienceLevel,
  label: level.charAt(0) + level.slice(1).toLowerCase(),
}));

export const LEARNING_INTEREST_LEVELS = Object.values(LearningInterestLevel).map((level) => {
  const label = level
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
  
  return {
    value: level as LearningInterestLevel,
    label
  };
});

export const PRONOUN_OPTIONS = [
  { value: "HE_HIM", label: "He/Him" },
  { value: "SHE_HER", label: "She/Her" },
  { value: "THEY_THEM", label: "They/Them" },
  { value: "OTHER", label: "Other" }
];

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "NON_BINARY", label: "Non-Binary" },
  { value: "OTHER", label: "Other" }
];

export const MATEROV_SUBTEAM_OPTIONS = [
  { value: "COMPUTATION_COMMUNICATIONS", label: "Computation and Communications" },
  { value: "ELECTRICAL_POWER", label: "Electrical and Power Systems" },
  { value: "FLUIDS_PROPULSION", label: "Fluids and Propulsion" },
  { value: "GNC", label: "Guidance, Navigation, and Control" },
  { value: "THERMAL_MECHANISMS_STRUCTURES", label: "Thermal, Mechanisms, and Structures" },
  { value: "LEADERSHIP", label: "MATE ROV Leadership" },
];

export const SKILL_OPTIONS = [
  { value: "CAD", label: "CAD (SolidWorks, Siemens NX, Catia, etc)" },
  { value: "PROGRAMMING", label: "Python (Numpy and SciPy)" },
  { value: "C_PLUS", label: "C, C++" },
  { value: "FEA", label: "FEA" },
  { value: "CFD", label: "CFD" },
  { value: "EMBEDDED", label: "Arduino/Raspberry Pi/Related" },
  { value: "CIRCUIT_DESIGN", label: "Circuit Design" },
  { value: "OTHER", label: "Other" },
];

export const LEARNING_AREA_OPTIONS = [
  { value: "SOFTWARE", label: "Software" },
  { value: "CAD", label: "CAD" },
  { value: "POWER", label: "Power" },
  { value: "FLUIDS", label: "Fluids" },
  { value: "GNC", label: "GNC" },
  { value: "OTHER", label: "Other" },
];