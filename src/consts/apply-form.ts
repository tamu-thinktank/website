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
    link: "https://www.aiaa.org/get-involved/students-educators/Design-Competitions",
  },
  {
    id: Challenge.Blue_Skies,
    label: "Environmental Monitoring Aircraft (Blue Skies)",
    link: "https://blueskies.nianet.org/competition/",
  },
  {
    id: Challenge.RASCAL_1,
    label: "Scalable Lunar Infrastructure (RASC-AL)",
    link: "https://rascal.nianet.org/",
  },
  {
    id: Challenge.RASCAL_2,
    label: "Lunar Servicing Robot (RASC-AL)",
    link: "https://rascal.nianet.org/",
  },
  {
    id: Challenge.Solar_District_Group,
    label: "University Solar Grid (Solar District Cup)",
    link: "https://www.herox.com/SolarDistrictCup",
  },
];
