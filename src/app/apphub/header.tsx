"use client";

import React, { useState } from "react";

const linksData = [
  {
    type: "Officer",
    name: "Officer Application",
    url: "/officer-apply",
    description:
      "• Officer team dedicated to helping members learn, grow, and become passionate about engineering for the real world.\n• Alumni preferred.",
    status: "closed",
    seemore: "about",
  },
  {
    type: "MateROV",
    name: "MateROV Application",
    url: "/materov-apply",
    description:
      "• Underwater robotics team where members design and build an autonomous rover for the MATE ROV competition.\n• Sophomores/Juniors preferred.",
    status: "closed",
    seemore: "/materov",
  },
  {
    type: "General",
    name: "Design Challenges Application",
    url: "#",
    description:
      "• Engineering capstone projects where members learn to design systems for real-world problems.\n• Freshmen/Sophomores preferred.",
    status: "closed",
    seemore: "src/app/challenges",
  },
  {
    type: "MiniDC",
    name: "MiniDC Application",
    url: "/minidc-apply",
    description:
      "• Shorter, hands-on engineering projects curated by ThinkTank to teach basic engineering principles.\n• Open to everyone.",
    status: "closed",
    seemore: "/MATE",
  },
];

const LinkCollectionPage: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatDescription = (description: string) => {
    return description.split("\n").map((line, index) => (
      <p key={index} className="text-white-600 text-sm">
        {line}
      </p>
    ));
  };

  return (
    <div className="relative w-full p-4 pt-16 sm:p-8 sm:pt-24 lg:p-12 lg:pt-32">
      <div className="flex flex-col items-start gap-0">
        <span className="font-dm-sans text-[0.93em] font-semibold text-[#B8B8B8] md:text-[0.93em]">
          2025-2026
        </span>
        <h1 className="font-poppins bg-gradient-to-r from-white to-gray-500 bg-clip-text text-[2rem] font-semibold text-transparent sm:text-[3rem] md:text-[4rem] lg:text-[5rem]">
          Application Hub
        </h1>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {linksData.map((link, index) => (
          <div
            key={index}
            className="flex w-full flex-col justify-between rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
              {link.name}
            </h2>
            <div className="mt-4">{formatDescription(link.description)}</div>

            {link.status === "open" && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <a
                  href={link.url}
                  className="w-full rounded-md bg-white px-4 py-2 text-center text-blue-600 sm:w-auto"
                >
                  Apply
                </a>
                <a
                  href={link.seemore}
                  className="w-full rounded-md border-2 border-white px-4 py-2 text-center text-white sm:w-auto"
                >
                  See More Info
                </a>
              </div>
            )}

            {link.status === "closed" && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button className="w-full cursor-not-allowed rounded-md bg-gray-400 px-4 py-2 text-center text-gray-700 sm:w-auto">
                  Closed
                </button>
                <button className="w-full cursor-not-allowed rounded-md border-2 border-gray-400 px-4 py-2 text-center text-gray-700 sm:w-auto">
                  See More Info
                </button>
              </div>
            )}

            {link.status === "soon" && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button className="w-full cursor-not-allowed rounded-md bg-yellow-500 px-4 py-2 text-center text-white sm:w-auto">
                  Apply
                </button>
                <button className="w-full cursor-not-allowed rounded-md border-2 border-yellow-500 px-4 py-2 text-center text-yellow-500 sm:w-auto">
                  See More Info
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
// test
export default LinkCollectionPage;
