"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Season, TeamType, StatisticsData } from "./StatsInfo";

// Define types for chart data
interface RatioData {
  name: string;
  value: number;
  percentage?: number;
}

interface PreferenceData {
  name: string;
  count: number;
  highInterest: number;
  mediumInterest: number;
  lowInterest: number;
  score: number;
}

export function StatisticsVisualizer() {
  const [activeTeam, setActiveTeam] = useState<TeamType>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("selectedTeam") as TeamType) ?? "DC";
    }
    return "DC";
  });

  const [selectedSeason, setSelectedSeason] = useState<Season>("2024-2025");
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<StatisticsData | null>(null);

  // Fetch data when team or season changes
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/statistics?season=${selectedSeason}&team=${activeTeam}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data: StatisticsData = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [activeTeam, selectedSeason]);

  // Listen for team change events
  useEffect(() => {
    const handleTeamChange = (event: CustomEvent<TeamType>) => {
      setActiveTeam(event.detail);
    };

    window.addEventListener("teamChange", handleTeamChange as EventListener);
    return () => {
      window.removeEventListener(
        "teamChange",
        handleTeamChange as EventListener,
      );
    };
  }, []);

  // Prepare chart data based on statistics
  const getApplicantStats = (): RatioData[] => {
    if (!stats) return [];
    return [
      { name: "Applicants", value: stats.team.applicants },
      { name: "Interviewees", value: stats.team.interviewees },
      { name: "Members", value: stats.team.members },
    ];
  };

  const getGlobalApplicantStats = (): RatioData[] => {
    if (!stats) return [];
    return [
      { name: "Applicants", value: stats.global.applicants },
      { name: "Interviewees", value: stats.global.interviewees },
      { name: "Members", value: stats.global.members },
    ];
  };

  const getMajorRatios = (): RatioData[] => {
    if (!stats) return [];
    return Object.entries(stats.teamDemographics.majors).map(
      ([major, data]) => ({
        name: major,
        value: data.count,
        percentage: data.percentage,
      }),
    );
  };

  const getYearRatios = (): RatioData[] => {
    if (!stats) return [];
    return Object.entries(stats.teamDemographics.years).map(([year, data]) => ({
      name: year,
      value: data.count,
      percentage: data.percentage,
    }));
  };

  const getGenderRatios = (): RatioData[] => {
    if (!stats) return [];
    return Object.entries(stats.teamDemographics.genders).map(
      ([gender, data]) => ({
        name: gender,
        value: data.count,
        percentage: data.percentage,
      }),
    );
  };

  const getReferralRatios = (): RatioData[] => {
    if (!stats) return [];
    return Object.entries(stats.referralSources).map(([source, data]) => ({
      name: source,
      value: data.count,
      percentage: data.percentage,
    }));
  };

  const getTeamPreferences = (): PreferenceData[] => {
    if (!stats) return [];
    return Object.entries(stats.teamPreferences).map(([team, data]) => ({
      name: team,
      count: data.count,
      highInterest: data.highInterest,
      mediumInterest: data.mediumInterest,
      lowInterest: data.lowInterest,
      score: data.score,
    }));
  };

  if (loading) {
    return (
      <div className="mx-auto mt-8 flex h-64 w-full max-w-7xl items-center justify-center">
        <p className="text-xl text-white">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-7xl space-y-8 pb-16">
      <div className="mb-8 flex justify-center space-x-4">
        <Select
          value={selectedSeason}
          onValueChange={(value) => setSelectedSeason(value as Season)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023-2024">2023-2024</SelectItem>
            <SelectItem value="2024-2025">2024-2025</SelectItem>
            <SelectItem value="2025-2026">2025-2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h2 className="text-center text-2xl font-bold text-white">
        {activeTeam} Statistics - {selectedSeason}
      </h2>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Applicants"
              value={stats?.team.applicants ?? 0}
              percentage={
                stats?.team.applicants ? (stats.team.applicants / 300) * 100 : 0
              }
              description="of capacity"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  percentage,
  description,
}: {
  title: string;
  value: number;
  percentage: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">
          {percentage.toFixed(1)}% {description}
        </p>
      </CardContent>
    </Card>
  );
}
