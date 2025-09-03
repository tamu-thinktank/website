import type { MATEROVApplyForm } from "@/lib/validations/materov-apply";

type MATEROVQuestions = {
  [Section in Exclude<keyof MATEROVApplyForm, "meetingTimes">]: {
    [QuestionKey in keyof MATEROVApplyForm[Section] | "title"]: string;
  };
};

export const qMateROV: MATEROVQuestions = {
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
    currentClasses: "Next Fall Semester Classes",
    nextClasses: "Next Spring Semester Classes",
    timeCommitment: "Time Commitments",
  },

  thinkTankInfo: {
    title: "ThinkTank Information",
    meetings:
      "Are you able to commit to and attend weekly team meetings in person, which will take place on Saturdays for the next 2 semesters?",
    weeklyCommitment:
      "Are you able to commit 8-10 hours per week (equivalent to 1 in-major engineering course) to your team for the entire duration of the project?",
    subteamPreferences: "Preferred Subteams",
    skills: "Experience & Skills",
    learningInterests: "What do you most want to learn?",
    previousParticipation:
      "Have you participated in a ThinkTank Design Challenge before?",
    referralSources: "Where did you hear about us?",
  },

  openEndedQuestions: {
    title: "Open-Ended Questions",
    firstQuestion:
      "Describe an instance where you worked with a team to accomplish a goal you were passionate about.",
    secondQuestion:
      "Describe an instance where you demonstrated your passion for a project, task, or subject matter.",
    thirdQuestion:
      "If you were previously in a ThinkTank design team, which previous team were you a member of and what did you specifically contribute? If you were not previously in ThinkTank, but have participated in an engineering design competition before, what was it and how did you contribute to the team?",
  },

  resume: {
    title: "Resume & Agreements",
    resumeId: "Resume Upload",
    signatureCommitment: "Commitment Signature",
    signatureAccountability: "Accountability Signature",
    signatureQuality: "Quality Pledge Signature",
  },
};
