// import type { MATEROVApplyForm } from "@/lib/validations/apply";
import { Challenge, InterestLevel, ExperienceLevel, LearningInterestLevel } from "@prisma/client";

// type Questions = {
//   [Section in Exclude<keyof ApplyForm, "meetingTimes">]: {
//     [QuestionKey in keyof ApplyForm[Section] | "title"]: string;
//   };
// };
// export const q: Questions = {
//   personal: {
//     title: "Personal Information",
//     fullName: "Full Name",
//     preferredName: "Preferred Name",
//     pronouns: "Preferred Pronouns",
//     gender: "Gender",
//     uin: "UIN",
//     email: "TAMU Email",
//     altEmail: "Additional Email Contact",
//     phone: "Contact Number",
//   },

//   academic: {
//     title: "Academic Information",
//     year: "Current Year at TAMU",
//     major: "Major",
//     currentClasses: "Current Semester Classes",
//     nextClasses: "Next Semester Classes",
//     timeCommitment: "Time Commitments",
//   },

//   thinkTankInfo: {
//     title: "ThinkTank Information",
//     meetings: "Are you able to attend a majority of meetings in-person?",
//     weeklyCommitment:
//       "Are you able to commit 8-10 hours per week (equivalent to 1 in-major engineering course) for the entire duration of the project?",
//     preferredTeams:
//       "For each selected team, rate your relative interest compared to other teams.",
//     researchAreas:
//       "For each selected research area, rate your relative interest compared to other research areas.",
//     referralSources:
//       "Where did you hear about us? (Select all that apply)",
//   },

//   openEndedQuestions: {
//     title: "Open-Ended Questions",
//     firstQuestion:
//       "Describe an instance where you demonstrated your passion for a project, task, or subject matter.",
//     secondQuestion:
//       "Describe an instance where you worked with a team to accomplish a goal you were passionate about.",
//   },

//   resume: {
//     title: "Resume & Agreements",
//     resumeId: "Resume Upload",
//     signatureCommitment: "Commitment Signature",
//     signatureAccountability: "Accountability Signature",
//     signatureQuality: "Quality Pledge Signature"
//   }
// };

// type OfficerQuestions = {
//   [Section in Exclude<keyof OfficerApplyForm, "meetingTimes">]: {
//     [QuestionKey in keyof OfficerApplyForm[Section] | "title"]: string;
//   };
// };

// // Officer-specific question labels
// export const qOfficer: OfficerQuestions = {
//   personal: {
//     title: "Personal Information",
//     fullName: "Full Name",
//     preferredName: "Preferred First Name",
//     pronouns: "Preferred Pronouns",
//     gender: "Gender",
//     uin: "UIN",
//     email: "TAMU Email",
//     altEmail: "Additional Email Contact",
//     phone: "Contact Number",
//   },

//   academic: {
//     title: "Academic Information",
//     year: "Current Year at TAMU (Beginning Next Fall)",
//     major: "Major",
//     summerPlans: "Summer Plans",
//     currentClasses: "Next Fall Semester Classes",
//     nextClasses: "Next Spring Semester Classes",
//     timeCommitment: "Time Commitments",
//   },

//   thinkTankInfo: {
//     title: "ThinkTank Information",
//     officerCommitment:
//       "Are you able to commit to and attend weekly team meetings in person on campus for the next 2 semesters? ",
//     preferredPositions:
//       "For each selected position, rate your relative interest compared to other positions.",
//   },

//   openEndedQuestions: {
//     title: "Open-Ended Questions",
//     firstQuestion:
//       "Which previous team were you a member of and what did you specifically contribute?",
//     secondQuestion:
//       "Why do you want to become a ThinkTank Officer?",
//   },

//   resume: {
//     title: "Resume & Agreements",
//     resumeId: "Resume Upload",
//     signatureCommitment: "Commitment Signature",
//     signatureAccountability: "Accountability Signature",
//     signatureQuality: "Quality Pledge Signature"
//   }
// };

// type MATEROVQuestions = {
//   [Section in Exclude<keyof MATEROVApplyForm, "meetingTimes">]: {
//     [QuestionKey in keyof MATEROVApplyForm[Section] | "title"]: string;
//   };
// };

// export const qMateROV: MATEROVQuestions = {
//   personal: {
//     title: "Personal Information",
//     fullName: "Full Name",
//     preferredName: "Preferred First Name",
//     pronouns: "Preferred Pronouns",
//     gender: "Gender",
//     uin: "UIN",
//     email: "TAMU Email",
//     altEmail: "Additional Email Contact",
//     phone: "Contact Number",
//   },

//   academic: {
//     title: "Academic Information",
//     year: "Current Year at TAMU (Beginning Next Fall)",
//     major: "Major",
//     currentClasses: "Next Fall Semester Classes",
//     nextClasses: "Next Spring Semester Classes",
//     timeCommitment: "Time Commitments",
//   },

//   thinkTankInfo: {
//     title: "ThinkTank Information",
//     meetings: "Are you able to commit to and attend weekly team meetings in person, which will take place on Saturdays for the next 2 semesters?",
//     weeklyCommitment: "Are you able to commit 8-10 hours per week (equivalent to 1 in-major engineering course) to your team for the entire duration of the project?",
//     subteamPreferences: "Preferred Subteams",
//     skills: "Experience & Skills",
//     learningInterests: "What do you most want to learn?",
//     previousParticipation: "Have you participated in a ThinkTank Design Challenge before?",
//     referralSources: "Where did you hear about us?",
//   },

//   openEndedQuestions: {
//     title: "Open-Ended Questions",
//     firstQuestion: "Describe an instance where you worked with a team to accomplish a goal you were passionate about.",
//     secondQuestion: "Describe an instance where you demonstrated your passion for a project, task, or subject matter.",
//     thirdQuestion: "If you were previously in a ThinkTank design team, which previous team were you a member of and what did you specifically contribute? If you were not previously in ThinkTank, but have participated in an engineering design competition before, what was it and how did you contribute to the team?",
//   },

//   resume: {
//     title: "Resume & Agreements",
//     resumeId: "Resume Upload",
//     signatureCommitment: "Commitment Signature",
//     signatureAccountability: "Accountability Signature",
//     signatureQuality: "Quality Pledge Signature"
//   }
// };

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

export const qMiniDC = {
  personal: {
    title: "Personal Information",
    fullName: "Full Name",
    preferredName: "Preferred First Name",
    pronouns: "Preferred Pronouns",
    gender: "Gender",
    uin: "UIN",
    email: "TAMU Email",
    altEmail: "Additional Email Contact",
    phone: "Contact Number",
  },

  academic: {
    title: "Academic Information",
    year: "Current Year at TAMU",
    major: "Major",
    currentClasses: "Current Semester Classes",
    timeCommitment: "Current Time Commitments",
    plannedCommitment: "Planned Time Commitments",
    weeklyCommitment: "Are you able to commit 5-7 hours per week (equivalent to 1 in-major engineering course) to your team for the entire duration of the project?"
  },

  openEndedQuestions: {
    title: "Open-Ended Questions",
    previousApplication: "Have you previously applied to ThinkTank? If yes, please specify which design challenge you applied for, and indicate the semester in which you applied.",
    goals: "What do you hope to achieve by participating in the Mini Design Challenge Competition?",
  },

  resume: {
    title: "Resume & Agreements",
    resumeId: "Resume Upload",
    signatureCommitment: "Commitment Signature",
    signatureAccountability: "Accountability Signature",
    signatureQuality: "Quality Pledge Signature"
  }
};

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