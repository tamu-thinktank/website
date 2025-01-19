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
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Season, TeamType } from "./StatsInfo";
import { seasonalData } from "./StatsInfo";

export function StatisticsVisualizer() {
  const [activeTeam, setActiveTeam] = useState<TeamType>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTeam") as TeamType;
    }
    return "DC";
  });

  const [selectedSeason, setSelectedSeason] = useState<Season>("2024-2025");
  const [selectedSubteam, setSelectedSubteam] = useState<string>(() => {
    return activeTeam === "DC" ? "RASCAL" : "Team 1";
  });

  useEffect(() => {
    const handleTeamChange = (event: CustomEvent<TeamType>) => {
      setActiveTeam(event.detail);
      setSelectedSubteam(event.detail === "DC" ? "RASCAL" : "Team 1");
    };

    window.addEventListener("teamChange", handleTeamChange as EventListener);
    return () => {
      window.removeEventListener(
        "teamChange",
        handleTeamChange as EventListener,
      );
    };
  }, []);

  const teamData = seasonalData[selectedSeason][activeTeam];
  const subteamData = teamData.subteams[selectedSubteam];

  const chartData = [
    { name: "Applicants", value: subteamData?.applicants ?? 0 },
    { name: "Interviewees", value: subteamData?.interviewees ?? 0 },
    { name: "Members", value: subteamData?.members ?? 0 },
  ];

  // Added this function to render subteam options
  const renderSubteamOptions = () => {
    const options = Object.keys(teamData.subteams);
    return options.map((subteam) => (
      <SelectItem key={subteam} value={subteam}>
        {subteam}
      </SelectItem>
    ));
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-7xl space-y-8">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Applicants"
          value={teamData.applicants}
          percentage={(teamData.applicants / 300) * 100}
        />
        <StatCard
          title="Interviewees"
          value={teamData.interviewees}
          percentage={(teamData.interviewees / teamData.applicants) * 100}
        />
        <StatCard
          title="Members"
          value={teamData.members}
          percentage={(teamData.members / teamData.interviewees) * 100}
        />
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Select value={selectedSubteam} onValueChange={setSelectedSubteam}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Subteam" />
          </SelectTrigger>
          <SelectContent>{renderSubteamOptions()}</SelectContent>
        </Select>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{selectedSubteam} Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8095ec" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  percentage,
}: {
  title: string;
  value: number;
  percentage: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">
          {percentage.toFixed(1)}%{" "}
          {title === "Applicants" ? "of capacity" : "conversion rate"}
        </p>
      </CardContent>
    </Card>
  );
}
