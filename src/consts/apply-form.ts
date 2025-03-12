import type { ApplyForm, OfficerApplyForm } from "@/lib/validations/apply";
import { Challenge, InterestLevel } from "@prisma/client";

type Questions = {
  [Section in Exclude<keyof ApplyForm, "meetingTimes">]: {
    [QuestionKey in keyof ApplyForm[Section] | "title"]: string;
  };
};
export const q: Questions = {
  personal: {
    title: "Personal Information",
    fullName: "Full Name",
    preferredName: "Preferred Name",
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
    nextClasses: "Next Semester Classes",
    timeCommitment: "Time Commitments",
  },

  thinkTankInfo: {
    title: "ThinkTank Information",
    meetings: "Are you able to attend a majority of meetings in-person?",
    weeklyCommitment:
      "Are you able to commit 8-10 hours per week (equivalent to 1 in-major engineering course) for the entire duration of the project?",
    preferredTeams:
      "For each selected team, rate your relative interest compared to other teams.",
    researchAreas:
      "For each selected research area, rate your relative interest compared to other research areas.",
    referralSources:
      "Where did you hear about us? (Select all that apply)",
  },

  openEndedQuestions: {
    title: "Open-Ended Questions",
    firstQuestion:
      "Describe an instance where you demonstrated your passion for a project, task, or subject matter.",
    secondQuestion:
      "Describe an instance where you worked with a team to accomplish a goal you were passionate about.",
  },

  resume: {
    title: "Resume & Agreements",
    resumeId: "Resume Upload",
    signatureCommitment: "Commitment Signature",
    signatureAccountability: "Accountability Signature",
    signatureQuality: "Quality Pledge Signature"
  }
};

type OfficerQuestions = {
  [Section in Exclude<keyof OfficerApplyForm, "meetingTimes">]: {
    [QuestionKey in keyof OfficerApplyForm[Section] | "title"]: string;
  };
};

// Officer-specific question labels
export const qOfficer: OfficerQuestions = {
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
    year: "Current Year at TAMU (Beginning Next Fall)",
    major: "Major",
    summerPlans: "Summer Plans",
    currentClasses: "Next Fall Semester Classes",
    nextClasses: "Next Spring Semester Classes",
    timeCommitment: "Time Commitments",
  },

  thinkTankInfo: {
    title: "ThinkTank Information",
    officerCommitment:
      "Are you able to commit 6 to 8 hours per week to your position for this summer and the next 2 semesters?",
    preferredPositions:
      "For each selected position, rate your relative interest compared to other positions.",
  },

  openEndedQuestions: {
    title: "Open-Ended Questions",
    firstQuestion:
      "Which previous team were you a member of and what did you specifically contribute?",
    secondQuestion:
      "Why do you want to become a ThinkTank Officer?",
  },

  resume: {
    title: "Resume & Agreements",
    resumeId: "Resume Upload",
    signatureCommitment: "Commitment Signature",
    signatureAccountability: "Accountability Signature",
    signatureQuality: "Quality Pledge Signature"
  }
};

// Officer-specific question labels
export const qDC: OfficerQuestions = {
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
    year: "Current Year at TAMU (Beginning Next Fall)",
    major: "Major",
    summerPlans: "Summer Plans",
    currentClasses: "Next Fall Semester Classes",
    nextClasses: "Next Spring Semester Classes",
    timeCommitment: "Time Commitments",
  },

  thinkTankInfo: {
    title: "ThinkTank Information",

    officerCommitment:
      "Are you able to commit to and attend weekly team meetings in person, which will take place on Saturdays for the next 2 semesters?",



    preferredPositions:
      "For each selected position, rate your relative interest compared to other positions.",
  },

  openEndedQuestions: {
    title: "Open-Ended Questions",
    firstQuestion: "Describe an instance where you worked with a team to accomplish a goal you were passionate about.",
    secondQuestion:
      "Describe an instance where you demonstrated your passion for a project, task, or subject matter.",
  },

  resume: {
    title: "Resume & Agreements",
    resumeId: "Resume Upload",
    signatureCommitment: "Commitment Signature",
    signatureAccountability: "Accountability Signature",
    signatureQuality: "Quality Pledge Signature"
  }
};

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

// Interest Level Options (for forms)
export const INTEREST_LEVELS = Object.values(InterestLevel).map((level) => ({
  value: level as InterestLevel,
  label: level.charAt(0) + level.slice(1).toLowerCase(),
}));

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