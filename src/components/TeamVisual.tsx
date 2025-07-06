"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StatisticsData {
  genders: Record<string, number>;
  years: Record<string, number>;
  referrals: Record<string, number>;
  majors: Record<string, number>;
  statusCounts: Record<string, number>;
  detailedData: {
    genders: { name: string; value: string }[];
    years: { name: string; value: string }[];
    referrals: { name: string; value: string }[];
    majors: { name: string; value: string }[];
  };
}

// More neutral color palette
const COLORS = [
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#0f172a",
  "#7f8ea3",
  "#526480",
];

export function StatisticsVisualizer() {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("OFFICER");

  // Update the fetchStatisticsForTeam function to ensure it's correctly passing the applicationType
  const fetchStatisticsForTeam = async (applicationType: string) => {
    setLoading(true);
    try {
      console.log(
        `Fetching statistics for application type: ${applicationType}`,
      );
      // Make sure we're using the correct API endpoint and parameter name
      const response = await fetch(
        `/api/statistics?applicationType=${applicationType}`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch statistics: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as StatisticsData;
      console.log(`Received statistics data for ${applicationType}:`, data);
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Make sure the useEffect dependency array includes selectedCategory
  useEffect(() => {
    console.log(`Selected category changed to: ${selectedCategory}`);
    void fetchStatisticsForTeam(selectedCategory);
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="mx-auto mt-8 flex h-64 w-full max-w-7xl items-center justify-center">
        <p className="text-xl">Loading statistics...</p>
      </div>
    );
  }

  const totalApplicants = Object.values(stats?.genders ?? {}).reduce(
    (a, b) => a + b,
    0,
  );
  const acceptedCount = stats?.statusCounts.ACCEPTED ?? 0;
  const rejectedCount = stats?.statusCounts.REJECTED ?? 0;
  const pendingCount = stats?.statusCounts.PENDING ?? 0;
  const interviewingCount = stats?.statusCounts.INTERVIEWING ?? 0;

  return (
    <div className="flex flex-col overflow-hidden bg-neutral-950 text-xl font-medium shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <div className="mt-1 flex w-full flex-col items-center overflow-hidden px-20 pb-96 pt-11 max-md:max-w-full max-md:px-5 max-md:pb-24">
        <div className="mb-0 flex w-full max-w-[1537px] flex-col max-md:mb-2.5 max-md:max-w-full">
          <div className="self-start pb-10 pt-20 text-center text-5xl font-semibold max-md:text-4xl">
            Statistics
          </div>

          <div className="flex w-full overflow-hidden rounded-[48px] border border-solid border-neutral-200">
            <div
              onClick={() => setSelectedCategory("OFFICER")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[37px_0px_0px_37px] py-2.5 text-center transition-colors max-md:max-w-full ${
                selectedCategory === "OFFICER"
                  ? "bg-gradient-to-r from-stone-700 to-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              OFFICER
            </div>
            <div className="w-[1.5px] bg-neutral-200"></div>
            <div
              onClick={() => setSelectedCategory("MATEROV")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[0px_37px_37px_0px] py-2.5 text-center transition-colors max-md:max-w-full ${
                selectedCategory === "MATEROV"
                  ? "bg-gradient-to-r from-stone-600 to-stone-700 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              MATE ROV
            </div>
          </div>

          <div className="mt-9 h-px w-full shrink-0 border border-solid border-neutral-200" />

          <div className="mx-auto mt-8 w-full max-w-7xl space-y-8 pb-16">
            <h2 className="text-center text-2xl font-bold">
              {selectedCategory} Applicant Statistics
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-5 lg:col-span-2">
                <StatCard title="Total Applicants" value={totalApplicants} />
                <StatCard
                  title="Accepted"
                  value={acceptedCount}
                  percentage={
                    totalApplicants > 0
                      ? ((acceptedCount / totalApplicants) * 100).toFixed(1) +
                        "%"
                      : "0%"
                  }
                  color="bg-green-100 dark:bg-green-900"
                />
                <StatCard
                  title="Interviewing"
                  value={interviewingCount}
                  percentage={
                    totalApplicants > 0
                      ? ((interviewingCount / totalApplicants) * 100).toFixed(
                          1,
                        ) + "%"
                      : "0%"
                  }
                  color="bg-blue-100 dark:bg-blue-900"
                />
                <StatCard
                  title="Rejected"
                  value={rejectedCount}
                  percentage={
                    totalApplicants > 0
                      ? ((rejectedCount / totalApplicants) * 100).toFixed(1) +
                        "%"
                      : "0%"
                  }
                  color="bg-red-100 dark:bg-red-900"
                />
                <StatCard
                  title="Pending"
                  value={pendingCount}
                  percentage={
                    totalApplicants > 0
                      ? ((pendingCount / totalApplicants) * 100).toFixed(1) +
                        "%"
                      : "0%"
                  }
                  color="bg-yellow-100 dark:bg-yellow-900"
                />
              </div>

              <PieChartCard
                title="Gender Distribution"
                data={stats?.genders}
                detailedData={stats?.detailedData.genders}
                totalCount={totalApplicants}
                attribute="Gender"
              />

              <PieChartCard
                title="Year Distribution"
                data={stats?.years}
                detailedData={stats?.detailedData.years}
                totalCount={totalApplicants}
                attribute="Year"
              />

              <PieChartCard
                title="Major Distribution"
                data={stats?.majors}
                detailedData={stats?.detailedData.majors}
                totalCount={totalApplicants}
                attribute="Major"
              />

              <PieChartCard
                title="Referral Sources"
                data={stats?.referrals}
                detailedData={stats?.detailedData.referrals}
                totalCount={totalApplicants}
                attribute="Referral Source"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  percentage,
  color,
}: {
  title: string;
  value: number | string;
  percentage?: string;
  color?: string;
}) {
  return (
    <Card className={`${color ?? ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {percentage && (
          <p className="text-sm text-muted-foreground">{percentage}</p>
        )}
      </CardContent>
    </Card>
  );
}

function PieChartCard({
  title,
  data,
  detailedData,
  totalCount,
  attribute,
}: {
  title: string;
  data?: Record<string, number>;
  detailedData?: { name: string; value: string }[];
  totalCount: number;
  attribute: string;
}) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(data).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <div className="h-80 cursor-pointer">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) =>
                      name.length > 10
                        ? `${name.substring(0, 10)}...: ${(percent * 100).toFixed(0)}%`
                        : `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} (${((value / totalCount) * 100).toFixed(1)}%)`,
                      "Count",
                    ]}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{title} Details</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {detailedData && detailedData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>{attribute}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <h3 className="font-medium">{attribute}</h3>
                      {chartData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 py-1"
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="col-span-1">
                      <h3 className="font-medium">Count (Percentage)</h3>
                      {chartData.map((item, index) => (
                        <div key={index} className="py-1">
                          {item.value} (
                          {((item.value / totalCount) * 100).toFixed(1)}%)
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
