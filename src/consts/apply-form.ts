import type { ApplyForm } from "@/lib/validations/apply";
import { Challenge } from "@prisma/client";

type Questions = {
  [Section in Exclude<keyof ApplyForm, "resumeId" | "meetingTimes">]: {
    [QuestionKey in keyof ApplyForm[Section] | "title"]: string;
  };
};
export const q: Questions = {
  personal: {
    title: "Personal Information",
    fullName: "Full Name",
    preferredName: "Preferred Name",
    preferredPronoun: "Preferred Pronouns",
    pronounsText: "Pronouns",
    gender: "Gender",
    genderText: "Gender",
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
    passionAnswer:
      "Describe an instance where you demonstrated your passion for a project, task, or subject matter.",
    teamworkAnswer:
      "Describe an instance where you worked with a team to accomplish a goal you were passionate about.",
  },
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
