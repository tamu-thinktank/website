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
        w-full mx-auto border-2 border-[rgba(83,81,81,0.5)] bg-[#1a1a1a] rounded-[10px] overflow-hidden transition-[height] duration-500 ease-in-out
        ${isExpanded
          ? "flex flex-col h-auto my-[20px] md:my-[30px]"
          : "flex md:flex-row flex-col h-[500px] md:h-[300px] my-[20px] md:my-[30px]"
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
          relative overflow-hidden cursor-pointer transition-[height] duration-500 ease-in-out
          ${isExpanded
            ? "md:w-full md:h-[450px]"
            : "md:w-1/2 md:h-[300px]"
          }
          w-full h-[200px]
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
          flex-1 bg-black flex flex-col relative overflow-y-auto text-[#bababa]
          ${isExpanded ? "max-h-full" : "max-h-[300px] md:max-h-full"}
          md:py-[15px] md:px-[20px] py-[10px] px-[15px]
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
            flex items-center justify-center font-bold uppercase font-poppins
            text-[1.2rem] ${isExpanded ? "mb-[10px]" : "mb-[5px]"}
          `}
        >
          <span
            className={`
              font-[Poppins,sans-serif] text-white text-center mr-[10px] 
              ${isExpanded ? "text-[1.5rem] pt-0" : "text-[2rem] pt-[10px]"}
            `}
          >
            {teamName.toUpperCase()}
          </span>
          <span className="mx-[10px] text-white text-[1.2rem] font-bold font-[Poppins,sans-serif] uppercase">|</span>
          <span
            className="text-[14px] font-bold font-[Poppins,sans-serif]"
            style={{ color: isOpen ? "#4CAF50" : "#FF5722" }}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Collapsed Content */}
        {!isExpanded && (
          <>
            <p className="mb-2 text-center font-semibold">{shortOverview}</p>
            <div className="flex flex-col items-center justify-center gap-[10px] mt-[10px] mb-[15px] md:mt-[15px] md:mb-[20px]">
              <a
                href="/materov-apply"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  no-underline text-center font-bold text-[16px] md:text-[16px] w-full max-w-[420px]
                  py-[8px] px-[16px] md:py-[10px] md:px-[20px] rounded-[50px] border-[0.5px] border-white 
                  ${isOpen ? "bg-white text-black transition-transform duration-300 ease-in-out hover:scale-105" : "bg-transparent text-white cursor-not-allowed opacity-50 pointer-events-none"}
                  ${isExpanded ? "max-w-[200px]" : "max-w-[420px]"}
                `}
              >
                {isOpen ? "Apply" : "Closed"}
              </a>
              <button
                onClick={handleToggle}
                className="px-[8px] py-[8px] md:px-[10px] md:py-[10px] w-full max-w-[420px] border border-[0.5px] border-[rgba(255,255,255,1)] rounded-[50px] text-[16px] text-white font-bold transition-transform duration-300 ease-in-out hover:scale-105"
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
              <div className="bg-[#050505] outline outline-[1px] outline-[rgba(82,80,80,0.5)] rounded-[10px] p-[15px] mb-[15px]">
                <h3 className="text-white font-bold mb-[10px] text-[1.2rem]">
                  Challenge Overview
                </h3>
                <p>{competitionOverview}</p>
              </div>

              {researchAreas ? (
                <div className="bg-[#050505] outline outline-[1px] outline-[rgba(82,80,80,0.5)] rounded-[10px] p-[15px] mb-[15px]">
                  <h3 className="text-white font-bold mb-[10px] text-[1.2rem]">
                    Research Areas
                  </h3>
                  <ul className="list-disc ml-[20px]">
                    {researchAreas.map((area, index) => (
                      <li key={index} className="mb-[8px] text-[0.9rem]">
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : pastTeams ? (
                <div className="bg-[#050505] outline outline-[1px] outline-[rgba(82,80,80,0.5)] rounded-[10px] p-[15px] mb-[15px]">
                  <h3 className="text-white font-bold mb-[10px] text-[1.2rem]">
                    Past Teams
                  </h3>
                  <ul className="list-disc ml-[20px]">
                    {pastTeams.map((team, index) => (
                      <li key={index} className="mb-[8px] text-[0.9rem]">
                        {team}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="bg-[#050505] outline outline-[1px] outline-[rgba(82,80,80,0.5)] rounded-[10px] p-[15px] mb-[15px]">
                <h3 className="text-white font-bold mb-[10px] text-[1.2rem]">
                  Details
                </h3>
                <ul className="list-disc ml-[20px]">
                  <li className="mb-[8px] text-[0.9rem]">
                    <strong className="inline">Duration:</strong> {duration}
                  </li>
                  <li className="mb-[8px] text-[0.9rem]">
                    <strong className="inline">Team Size:</strong> {teamSize}
                  </li>
                </ul>
              </div>

              <div className="my-[15px] text-left bg-[#050505] outline outline-[1px] outline-[rgba(82,80,80,0.5)] rounded-[10px] p-[15px] mb-[15px]">
                <h3 className="text-white font-bold mb-[15px] text-[1.2rem]">
                  Admission Timeline
                </h3>
                <div className="h-[5px] rounded-[10px] bg-white w-[80%] relative mx-auto"></div>
                <div className="flex justify-between relative mt-[10px] w-[90%] mx-auto">
                  {admissionTimeline.map((entry, index) => (
                    <div key={index} className="flex flex-col items-center relative w-[90%]">
                      <div
                        className="h-[10px] w-[10px] rounded-full mb-[5px]"
                        style={{ backgroundColor: getMarkerColor(entry.date) }}
                      ></div>
                      <div className="text-center text-[0.8rem] md:text-[0.8rem]">
                        <strong className="block text-white">{entry.date}</strong>
                        {entry.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-row justify-center gap-[20px] mt-[15px]">
                <a
                  href={competitionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-[8px] py-[8px] md:px-[10px] md:py-[10px] w-full max-w-[420px] border border-[0.5px] border-[rgba(255,255,255,1)] rounded-[50px] text-[16px] text-center text-white font-bold transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Competition Link
                </a>
                <a
                  href="/materov-apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    no-underline text-center font-bold text-[16px] md:text-[16px] w-full max-w-[420px]
                    py-[8px] px-[16px] md:py-[10px] md:px-[20px] rounded-[50px] border-[0.5px] border-white 
                    ${isOpen ? "bg-white text-black transition-transform duration-300 ease-in-out hover:scale-105" : "bg-transparent text-white cursor-not-allowed opacity-50 pointer-events-none"}
                    ${isExpanded ? "max-w-[200px]" : "max-w-[420px]"}
                  `}
                >
                  {isOpen ? "Apply" : "Closed"}
                </a>
              </div>
              <div className="flex justify-center mt-[15px] w-full">
                <button
                  onClick={handleToggle}
                  className="px-[8px] py-[8px] md:px-[10px] md:py-[10px] w-full max-w-[420px] border border-[0.5px] border-[rgba(255,255,255,1)] rounded-[50px] text-[16px] text-white font-bold transition-transform duration-300 ease-in-out hover:scale-105"
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
