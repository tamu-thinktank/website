import React from "react";

const AboutHeader: React.FC = () => {
  return (
    <div className="relative w-full p-8 pt-48 md:p-12 md:pl-24 lg:p-16 lg:pl-32">
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-dm-sans text-[0.93em] font-semibold text-[#B8B8B8] md:text-[0.93em]">
          About
        </span>
        <h1 className="font-poppins bg-gradient-to-r from-white to-gray-500 bg-clip-text text-[3.9rem] font-semibold text-transparent md:text-[5.2rem] lg:text-[6.5rem]">
          ThinkTank
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
  );
};

export default AboutHeader;
