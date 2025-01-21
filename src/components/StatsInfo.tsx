// temporary dummy stats
export type TeamType = "MATE ROV" | "DC";
export type Season = "2023-2024" | "2024-2025" | "2025-2026";

export interface SubteamData {
  applicants: number;
  interviewees: number;
  members: number;
}

export interface TeamData {
  applicants: number;
  interviewees: number;
  members: number;
  subteams: Record<string, SubteamData>;
}

export interface SeasonData {
  DC: TeamData;
  "MATE ROV": TeamData;
}

export const seasonalData: Record<Season, SeasonData> = {
  "2023-2024": {
    DC: {
      applicants: 180,
      interviewees: 110,
      members: 55,
      subteams: {
        RASCAL: { applicants: 25, interviewees: 18, members: 8 },
        ATLAS: { applicants: 30, interviewees: 22, members: 9 },
        NOVA: { applicants: 35, interviewees: 25, members: 12 },
        SERVUS: { applicants: 30, interviewees: 20, members: 8 },
        SOLARA: { applicants: 25, interviewees: 15, members: 5 },
        VOLTARIS: { applicants: 20, interviewees: 12, members: 4 },
        ORION: { applicants: 15, interviewees: 8, members: 4 },
      },
    },
    "MATE ROV": {
      applicants: 90,
      interviewees: 65,
      members: 35,
      subteams: {
        "Team 1": { applicants: 22, interviewees: 15, members: 8 },
        "Team 2": { applicants: 18, interviewees: 13, members: 7 },
        "Team 3": { applicants: 20, interviewees: 15, members: 8 },
        "Team 4": { applicants: 15, interviewees: 12, members: 6 },
        "Team 5": { applicants: 15, interviewees: 10, members: 6 },
      },
    },
  },
  "2024-2025": {
    DC: {
      applicants: 200,
      interviewees: 120,
      members: 60,
      subteams: {
        RASCAL: { applicants: 30, interviewees: 20, members: 10 },
        ATLAS: { applicants: 35, interviewees: 25, members: 10 },
        NOVA: { applicants: 40, interviewees: 30, members: 15 },
        SERVUS: { applicants: 35, interviewees: 25, members: 10 },
        SOLARA: { applicants: 30, interviewees: 20, members: 5 },
        VOLTARIS: { applicants: 20, interviewees: 15, members: 5 },
        ORION: { applicants: 10, interviewees: 5, members: 5 },
      },
    },
    "MATE ROV": {
      applicants: 100,
      interviewees: 75,
      members: 40,
      subteams: {
        "Team 1": { applicants: 25, interviewees: 18, members: 10 },
        "Team 2": { applicants: 20, interviewees: 15, members: 8 },
        "Team 3": { applicants: 22, interviewees: 17, members: 9 },
        "Team 4": { applicants: 18, interviewees: 14, members: 7 },
        "Team 5": { applicants: 15, interviewees: 11, members: 6 },
      },
    },
  },
  "2025-2026": {
    DC: {
      applicants: 220,
      interviewees: 130,
      members: 65,
      subteams: {
        RASCAL: { applicants: 35, interviewees: 22, members: 12 },
        ATLAS: { applicants: 38, interviewees: 27, members: 11 },
        NOVA: { applicants: 42, interviewees: 32, members: 16 },
        SERVUS: { applicants: 37, interviewees: 27, members: 11 },
        SOLARA: { applicants: 32, interviewees: 22, members: 6 },
        VOLTARIS: { applicants: 22, interviewees: 17, members: 6 },
        ORION: { applicants: 14, interviewees: 7, members: 6 },
      },
    },
    "MATE ROV": {
      applicants: 110,
      interviewees: 80,
      members: 45,
      subteams: {
        "Team 1": { applicants: 27, interviewees: 20, members: 11 },
        "Team 2": { applicants: 22, interviewees: 17, members: 9 },
        "Team 3": { applicants: 24, interviewees: 19, members: 10 },
        "Team 4": { applicants: 20, interviewees: 16, members: 8 },
        "Team 5": { applicants: 17, interviewees: 13, members: 7 },
      },
    },
  },
};
