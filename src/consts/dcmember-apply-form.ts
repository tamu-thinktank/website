import type { DCMemberApplyForm } from "@/lib/validations/dcmember-apply";

type Questions = {
  [Section in Exclude<keyof DCMemberApplyForm, "meetingTimes">]: {
    [QuestionKey in keyof DCMemberApplyForm[Section] | "title"]: string;
  };
};
export const qDCMember: Questions = {
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