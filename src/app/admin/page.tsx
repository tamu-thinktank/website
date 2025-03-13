"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Users, FileText, BarChart2, Search } from "lucide-react";
import { useState } from "react";

export default function AdminHub() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const adminModules = [
    {
      title: "Applicants",
      description: "Review and manage applicant information",
      icon: <FileText className="h-8 w-8" />,
      href: "/admin/applicants",
      color: "from-stone-700 to-stone-600",
    },
    {
      title: "Interviewees",
      description: "Manage candidates in the interview process",
      icon: <Search className="h-8 w-8" />,
      href: "/admin/interviewees",
      color: "from-stone-800 to-stone-700",
    },
    {
      title: "Members",
      description: "View team members",
      icon: <Users className="h-8 w-8" />,
      href: "/admin/members",
      color: "from-stone-800 to-stone-700",
    },
    {
      title: "Scheduler",
      description: "Manage interview schedules",
      icon: <CalendarDays className="h-8 w-8" />,
      href: "/admin/scheduler",
      color: "from-stone-900 to-stone-800",
    },
    {
      title: "Statistics",
      description: "View application and member statistics",
      icon: <BarChart2 className="h-8 w-8" />,
      href: "/admin/stats",
      color: "from-stone-950 to-stone-900",
    },
  ];

  return (
    <div className="min-h-screen p-8 pt-32" style={{ background: "#0C0D0E" }}>
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-neutral-100">
          Dashboard
        </h1>
        <p className="mt-3 text-lg text-neutral-400">stuff for admins</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module, index) => (
          <Link
            href={module.href}
            key={index}
            className="group relative block h-full"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Highlight border effect */}
            <span
              className={`absolute inset-0 rounded-xl ${hoveredIndex === index ? "opacity-100" : "opacity-0"} bg-gradient-to-r from-blue-500 to-purple-600 p-1 transition-opacity duration-300`}
            ></span>

            <Card className="relative h-full border-none bg-neutral-900 text-white transition-all duration-300 group-hover:translate-y-[-4px]">
              <CardHeader
                className={`rounded-t-lg bg-gradient-to-br ${module.color} p-6`}
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-black/20 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/30">
                    {module.icon}
                  </div>
                  <CardTitle className="text-xl font-medium">
                    {module.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardDescription className="text-base font-light text-neutral-300">
                  {module.description}
                </CardDescription>
              </CardContent>

              {/* Subtle arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
