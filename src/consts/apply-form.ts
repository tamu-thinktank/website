import { Challenge } from "@prisma/client";

export const q = {
  personal: {
    title: "Personal Information",
    fullName: "Full Name",
    email: "TAMU Email",
    uin: "UIN",
    altEmail: "Additional Email Contact",
    phone: "Contact Number",
    year: "Current Year at TAMU",
    major: "Major",
    availability: "Are you able to add a class's worth of work to your schedule?",
  },
  interests: {
    title: "Interests and Motivation",
    interestedAnswer: "Why are you interested in joining ThinkTank?",
    challenges: "Which Design Challenges are you interested in?",
    interestedChallenge: "Which Design Challenge are you most interested in?",
    passionAnswer:
      "Describe an instance where you demonstrated your passion for a project, task, or subject matter",
    isLeadership: "Are you interested in a leadership position on a team?",
  },
  leadership: {
    title: "Leadership",
    skillsAnswer:
      "Describe a situation where you demonstrated leadership skills",
    conflictsAnswer: "How do you handle conflicts within a team environment?",
    presentation: "Rate your presentation skills on a scale from 1 to 5",
    timeManagement:
      "How would you rate your ability to meet deadlines and manage time effectively?",
    relevantExperience:
      "Describe any relevant experience you have for this design challenge",
    timeCommitment:
      "Are you able to commit 10+ hours per week with flexibility to accommodate general team availability?",
  },
} as const;

export const longAnswerLimit = 1000;

export const challenges: {
  id: Challenge;
  label: string;
  link: string;
}[] = [
  {
    id: Challenge.AIAA,
    label: "Placeholder (AIAA)",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.Blue_Skies,
    label: "Environmental Monitoring Aircraft (Blue Skies)",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.GoAero,
    label: "Compact Autonomous Rescue Aircraft (GoAero)",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.RASCAL_1,
    label: "Scalable Lunar Infrastructure (RASCAL 1)",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.RASCAL_2,
    label: "Lunar Servicing Robot (RASCAL 2)",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.Solar_District_Group,
    label: "University Solar Grid (Solar District Cup)",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.TSGC,
    label: "Space-Grade pH regulator (TSGC)",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
];
