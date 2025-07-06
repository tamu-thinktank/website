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
          className="absolute right-16 bottom-4 h-8 w-8 rotate-180 md:right-24 md:bottom-12 md:h-10 md:w-10 lg:right-32 lg:bottom-16 lg:h-12 lg:w-12"
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
        <div className="space-y-6 px-8 pb-20">
          <p className="text-lg text-gray-300">
            The MATE ROV (Marine Advanced Technology Education Remotely Operated
            Vehicle) Competition challenges students to engineer and operate an
            underwater robot to complete a variety of mission tasks in a
            high-stakes environment against other universities. Members get
            direct, hands-on experience in their interests while working with a
            passionate, interdisciplinary team of peers.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default AboutHeader;
