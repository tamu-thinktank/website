"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TeamType } from "./StatsInfo";

export function TeamToggler() {
  const [activeTeam, setActiveTeam] = useState<TeamType>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTeam") as TeamType;
    }
    return "DC";
  });

  useEffect(() => {
    localStorage.setItem("selectedTeam", activeTeam);
    const event = new CustomEvent("teamChange", { detail: activeTeam });
    window.dispatchEvent(event);
  }, [activeTeam]);

  const handleToggle = (teamType: TeamType) => {
    setActiveTeam(teamType);
  };

  return (
    <div className="mx-auto mt-20 flex w-full max-w-7xl items-center justify-center">
      <div className="relative h-[54px] w-[1760px] rounded-full border border-white border-opacity-50 bg-transparent">
        <motion.div
          className="absolute h-[calc(100%-2px)] w-[calc(50%-1px)] rounded-full bg-white bg-opacity-20"
          layout
          transition={{
            type: "tween",
            duration: 0.3,
            ease: "easeInOut",
          }}
          initial={false}
          animate={{
            left: activeTeam === "DC" ? "1px" : "calc(50% + 1px)",
          }}
        />
        <button
          className={`font-regular z-1 relative h-full w-1/2 rounded-full text-center text-[1.1rem] transition-colors ${
            activeTeam === "DC" ? "text-white" : "text-gray-300"
          }`}
          onClick={() => handleToggle("DC")}
        >
          DC
        </button>
        <button
          className={`font-regular z-1 relative h-full w-1/2 rounded-full text-center text-[1.1rem] transition-colors ${
            activeTeam === "MATE ROV" ? "text-white" : "text-gray-300"
          }`}
          onClick={() => handleToggle("MATE ROV")}
        >
          MATE ROV
        </button>
      </div>
    </div>
  );
}
