export type TeamType = "DC" | "MATE ROV";
export type Season = "2023-2024" | "2024-2025" | "2025-2026";

export interface StatisticsData {
  global: {
    applicants: number;
    interviewees: number;
    members: number;
  };
  team: {
    name: string;
    applicants: number;
    interviewees: number;
    members: number;
  };
  demographics: {
    majors: Record<string, { count: number; percentage: number }>;
    years: Record<string, { count: number; percentage: number }>;
    genders: Record<string, { count: number; percentage: number }>;
  };
  teamDemographics: {
    majors: Record<string, { count: number; percentage: number }>;
    years: Record<string, { count: number; percentage: number }>;
    genders: Record<string, { count: number; percentage: number }>;
  };
  referralSources: Record<string, { count: number; percentage: number }>;
  teamPreferences: Record<
    string,
    {
      count: number;
      highInterest: number;
      mediumInterest: number;
      lowInterest: number;
      score: number;
    }
  >;
  researchInterests: Record<
    string,
    {
      count: number;
      highInterest: number;
      mediumInterest: number;
      lowInterest: number;
      score: number;
    }
  >;
}
