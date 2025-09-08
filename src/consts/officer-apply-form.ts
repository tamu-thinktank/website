import type { OfficerApplyForm } from "@/lib/validations/officer-apply";

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
      "Are you able to commit to and attend weekly team meetings in person on campus for the next 2 semesters? ",
    preferredPositions:
      "For each selected position, rate your relative interest compared to other positions.",
  },

  openEndedQuestions: {
    title: "Open-Ended Questions",
    firstQuestion:
      "Which previous team were you a member of and what did you specifically contribute?",
    secondQuestion: "Why do you want to become a ThinkTank Officer?",
  },

  resume: {
    title: "Resume & Agreements",
    resumeId: "Resume Upload",
    signatureCommitment: "Commitment Signature",
    signatureAccountability: "Accountability Signature",
    signatureQuality: "Quality Pledge Signature",
  },
};
