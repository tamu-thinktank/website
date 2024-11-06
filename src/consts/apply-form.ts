import type { ApplyForm } from "@/lib/validations/apply";
import { Challenge } from "@prisma/client";

export const longAnswerLimit = 1000;

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
    email: "TAMU Email",
    uin: "UIN",
    altEmail: "Additional Email Contact",
    phone: "Contact Number",
    year: "Current Year at TAMU",
    major: "Major",
    availability:
      "Are you able to add a class's worth of work to your schedule?",
  },
  interests: {
    title: "Interests and Motivation",
    interestedAnswer: "Why are you interested in joining ThinkTank?",
    challenges: "Which Design Challenges are you interested in?",
    interestedChallenge: "Which Design Challenge are you most interested in?",
    passionAnswer:
      "Describe an instance where you demonstrated your passion for a project, task, or subject matter",
    isLeadership: "Are you interested in a Team Lead position?",
  },
  leadership: {
    title: "Leadership",
    skillsAnswer:
      "Describe a situation where you demonstrated leadership skills",
    conflictsAnswer: "How do you handle conflicts within a team environment?",
    timeManagement:
      "How would you rate your ability to meet deadlines and manage time effectively?",
    relevantExperience:
      "Describe any relevant experience you have for this design challenge",
    timeCommitment:
      "Are you able to add 2 class's worth of work to your schedule?",
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
  }
];
