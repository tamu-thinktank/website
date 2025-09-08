import type { MiniDCApplyForm } from "@/lib/validations/minidc-apply";

type MiniDCQuestions = {
  [Section in Exclude<keyof MiniDCApplyForm, "meetingTimes">]: {
    [QuestionKey in keyof MiniDCApplyForm[Section] | "title"]: string;
  };
};

export const qMiniDC: MiniDCQuestions = {
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
    timeCommitment: "Time Commitments",
    weeklyCommitment:
      "Are you able to commit 5-7 hours per week (equivalent to 1 in-major engineering course) to your team for the entire duration of the project?",
  },

  openEndedQuestions: {
    title: "Open-Ended Questions",
    previousApplication:
      "Have you previously applied to ThinkTank? If yes, please specify which design challenge you applied for, and indicate the semester in which you applied.",
    goals:
      "What do you hope to achieve by participating in the Mini Design Challenge Competition?",
  },

  resume: {
    title: "Resume & Agreements",
    resumeId: "Resume Upload",
    signatureCommitment: "Commitment Signature",
    signatureAccountability: "Accountability Signature",
    signatureQuality: "Quality Pledge Signature",
  },
};
