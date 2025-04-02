"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface AdmissionTimelineEntry {
  date: string;
  description: string;
}

interface BoxProps {
  teamName: string;
  shortOverview?: string;
  competitionOverview: string;
  duration: string;
  teamSize: string;
  admissionTimeline: AdmissionTimelineEntry[];
  researchAreas?: string[];
  pastTeams?: string[];
  competitionLink?: string;
  imageUrl: string;
}

const BoxComponent: React.FC<BoxProps> = ({
  teamName,
  shortOverview,
  competitionOverview,
  duration,
  teamSize,
  admissionTimeline,
  researchAreas,
  pastTeams,
  competitionLink,
  imageUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const openTeams = [
    "Computation and Communications",
    "Electrical and Power Systems",
    "Fluids and Propulsion",
    "Guidance, Navigation, and Control",
    "Thermal, Mechanisms, and Structures",
    "MATE ROV Leadership",
  ];
  const isOpen = openTeams.includes(teamName);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      const boxElement = document.getElementById(`box-${teamName}`);
      if (boxElement) {
        boxElement.scrollTop = 0;
      }
      const textSection = boxElement?.querySelector("[data-text-section]");
      if (textSection) {
        textSection.scrollTop = 0;
      }
    }
  }, [isExpanded, teamName]);

  useEffect(() => {
    const handleResize = () => {
      const boxElement = document.getElementById(`box-${teamName}`);
      if (boxElement) {
        if (window.innerWidth <= 768) {
          boxElement.style.height = isExpanded ? "auto" : "500px";
        } else {
          boxElement.style.height = isExpanded ? "auto" : "300px";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded, teamName]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const variants = {
    collapsed: {
      height: "auto",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    expanded: {
      height: "auto",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const getMarkerColor = (date: string) => {
    const deadlineDate = new Date(date);
    const currentDate = new Date("2024-11-07");
    return currentDate > deadlineDate ? "red" : "green";
  };

  return (
    <motion.div
      id={`box-${teamName}`}
      className={`
        mx-auto w-full overflow-hidden rounded-[10px] border-2 border-[rgba(83,81,81,0.5)] bg-[#1a1a1a] transition-[height] duration-500 ease-in-out
        ${
          isExpanded
            ? "my-[20px] flex h-auto flex-col md:my-[30px]"
            : "my-[20px] flex h-[500px] flex-col md:my-[30px] md:h-[300px] md:flex-row"
        }
      `}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Image Section */}
      <div
        className={`
          relative cursor-pointer overflow-hidden transition-[height] duration-500 ease-in-out
          ${isExpanded ? "md:h-[450px] md:w-full" : "md:h-[300px] md:w-1/2"}
          h-[200px] w-full
        `}
        onClick={() =>
          window.open(competitionLink, "_blank", "noopener,noreferrer")
        }
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`${teamName} visual`}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-500 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
            onLoadingComplete={() => setIsLoaded(true)}
          />
        )}
      </div>

      {/* Text Section */}
      <div
        data-text-section
        className={`
          relative flex flex-1 flex-col overflow-y-auto bg-black text-[#bababa]
          ${isExpanded ? "max-h-full" : "max-h-[300px] md:max-h-full"}
          px-[15px] py-[10px] md:px-[20px] md:py-[15px]
        `}
        style={{
          transition: "max-height 0.5s ease-in-out",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Header */}
        <div
          className={`
            font-poppins flex items-center justify-center text-[1.2rem] font-bold
            uppercase ${isExpanded ? "mb-[10px]" : "mb-[5px]"}
          `}
        >
          <span
            className={`
              mr-[10px] text-center font-[Poppins,sans-serif] text-white 
              ${isExpanded ? "pt-0 text-[1.5rem]" : "pt-[10px] text-[2rem]"}
            `}
          >
            {teamName.toUpperCase()}
          </span>
          <span className="mx-[10px] font-[Poppins,sans-serif] text-[1.2rem] font-bold uppercase text-white">
            |
          </span>
          <span
            className="font-[Poppins,sans-serif] text-[14px] font-bold"
            style={{ color: "#FF5722" }}
          >
            {/*{isOpen ? "Open" : "Closed"}*/}
            Closed
          </span>
        </div>

        {/* Collapsed Content */}
        {!isExpanded && (
          <>
            <p className="mb-2 text-center font-semibold">{shortOverview}</p>
            <div className="mb-[15px] mt-[10px] flex flex-col items-center justify-center gap-[10px] md:mb-[20px] md:mt-[15px]">
              <a
                href="/materov-apply"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full max-w-[420px] rounded-[50px] border-[0.5px] border-white px-[16px] py-[8px]
                  text-center text-[16px] font-bold no-underline md:px-[20px] md:py-[10px] md:text-[16px] 
                  ${"pointer-events-none cursor-not-allowed bg-transparent text-white opacity-50"}
                  ${isExpanded ? "max-w-[200px]" : "max-w-[420px]"}
                `}
              >
                {/*{isOpen ? "Open" : "Closed"}*/}
                Closed
              </a>
              <button
                onClick={handleToggle}
                className="w-full max-w-[420px] rounded-[50px] border border-[0.5px] border-[rgba(255,255,255,1)] px-[8px] py-[8px] text-[16px] font-bold text-white transition-transform duration-300 ease-in-out hover:scale-105 md:px-[10px] md:py-[10px]"
              >
                See More
              </button>
            </div>
          </>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-[15px] rounded-[10px] bg-[#050505] p-[15px] outline outline-[1px] outline-[rgba(82,80,80,0.5)]">
                <h3 className="mb-[10px] text-[1.2rem] font-bold text-white">
                  Challenge Overview
                </h3>
                <p>{competitionOverview}</p>
              </div>

              {researchAreas ? (
                <div className="mb-[15px] rounded-[10px] bg-[#050505] p-[15px] outline outline-[1px] outline-[rgba(82,80,80,0.5)]">
                  <h3 className="mb-[10px] text-[1.2rem] font-bold text-white">
                    Research Areas
                  </h3>
                  <ul className="ml-[20px] list-disc">
                    {researchAreas.map((area, index) => (
                      <li key={index} className="mb-[8px] text-[0.9rem]">
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : pastTeams ? (
                <div className="mb-[15px] rounded-[10px] bg-[#050505] p-[15px] outline outline-[1px] outline-[rgba(82,80,80,0.5)]">
                  <h3 className="mb-[10px] text-[1.2rem] font-bold text-white">
                    Past Teams
                  </h3>
                  <ul className="ml-[20px] list-disc">
                    {pastTeams.map((team, index) => (
                      <li key={index} className="mb-[8px] text-[0.9rem]">
                        {team}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mb-[15px] rounded-[10px] bg-[#050505] p-[15px] outline outline-[1px] outline-[rgba(82,80,80,0.5)]">
                <h3 className="mb-[10px] text-[1.2rem] font-bold text-white">
                  Details
                </h3>
                <ul className="ml-[20px] list-disc">
                  <li className="mb-[8px] text-[0.9rem]">
                    <strong className="inline">Duration:</strong> {duration}
                  </li>
                  <li className="mb-[8px] text-[0.9rem]">
                    <strong className="inline">Team Size:</strong> {teamSize}
                  </li>
                </ul>
              </div>

              <div className="my-[15px] mb-[15px] rounded-[10px] bg-[#050505] p-[15px] text-left outline outline-[1px] outline-[rgba(82,80,80,0.5)]">
                <h3 className="mb-[15px] text-[1.2rem] font-bold text-white">
                  Admission Timeline
                </h3>
                <div className="relative mx-auto h-[5px] w-[80%] rounded-[10px] bg-white"></div>
                <div className="relative mx-auto mt-[10px] flex w-[90%] justify-between">
                  {admissionTimeline.map((entry, index) => (
                    <div
                      key={index}
                      className="relative flex w-[90%] flex-col items-center"
                    >
                      <div
                        className="mb-[5px] h-[10px] w-[10px] rounded-full"
                        style={{ backgroundColor: getMarkerColor(entry.date) }}
                      ></div>
                      <div className="text-center text-[0.8rem] md:text-[0.8rem]">
                        <strong className="block text-white">
                          {entry.date}
                        </strong>
                        {entry.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-[15px] flex flex-row justify-center gap-[20px]">
                <a
                  href={competitionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[420px] rounded-[50px] border border-[0.5px] border-[rgba(255,255,255,1)] px-[8px] py-[8px] text-center text-[16px] font-bold text-white transition-transform duration-300 ease-in-out hover:scale-105 md:px-[10px] md:py-[10px]"
                >
                  Competition Link
                </a>
                <a
                  href="/materov-apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    w-full max-w-[420px] rounded-[50px] border-[0.5px] border-white px-[16px] py-[8px]
                    text-center text-[16px] font-bold no-underline md:px-[20px] md:py-[10px] md:text-[16px] 
                    ${"pointer-events-none cursor-not-allowed bg-transparent text-white opacity-50"}
                    ${isExpanded ? "max-w-[200px]" : "max-w-[420px]"}
                  `}
                >
                  {/*{isOpen ? "Open" : "Closed"}*/}
                  Closed
                </a>
              </div>
              <div className="mt-[15px] flex w-full justify-center">
                <button
                  onClick={handleToggle}
                  className="w-full max-w-[420px] rounded-[50px] border border-[0.5px] border-[rgba(255,255,255,1)] px-[8px] py-[8px] text-[16px] font-bold text-white transition-transform duration-300 ease-in-out hover:scale-105 md:px-[10px] md:py-[10px]"
                >
                  See Less
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BoxComponent;
