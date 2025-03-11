import React from "react";
import Container from "@/components/Container";

const AboutHeader: React.FC = () => {
  return (
    <div>
      <div className="relative w-full p-8 md:p-12 md:px-24 lg:p-16 lg:px-32">
        <div className="flex flex-col items-start gap-0">
          <span className="font-dm-sans text-[0.93em] font-semibold text-[#B8B8B8] md:text-[0.93em]">
            2025-2026
          </span>
          <h1 className="font-poppins bg-gradient-to-r from-white to-gray-500 bg-clip-text text-[3.9rem] font-semibold text-transparent md:text-[5.2rem] lg:text-[6.5rem]">
            MATE ROV
          </h1>
        </div>
        <svg
          className="absolute bottom-4 right-16 h-8 w-8 rotate-180 md:bottom-12 md:right-24 md:h-10 md:w-10 lg:bottom-16 lg:right-32 lg:h-12 lg:w-12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <Container>
        <div className= "px-8 pb-20 space-y-6">
          <p className="text-lg text-gray-300 mb-20">
            The MATE (Marine Advanced Technology Education) ROV Competition challenges students to engineer and operate a remotely operated vehicle to complete mission tasks. Members get hands-on experience with interdisciplinary engineering, along with strengthening teamworking, project management, and complex problem solving skills.
          </p>
          <h3 className="text-2xl font-bold italic text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
            <span style={{ color: "#B8B8B8" }}>Subteams</span>
          </h3>
          <p className="text-lg text-gray-300">
            ThinkTank's MATE ROV team will be split into specialized subteams, all of whom are responsible for separate yet critical aspects of the competition. The division into subteams will make sure that every component of the team's final product is developed efficiently and equally. Members will also be assigned to specific subteams based on their specific interests and skillsets.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default AboutHeader;
