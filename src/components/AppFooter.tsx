"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ContactForm from "./ContactForm";
import { ArrowUpRight, ArrowUp, Instagram, Linkedin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

const TAMULogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 247 203"
    fill="currentColor"
    {...props}
  >
    <path d="M217.9,66.4l-18.2,38l-18.2,-38h-27.5v17.2h6.3v52.5h-6.6v17.2h31v-17.2h-6.7v-37.2l21.85,45l21.85,-45v37.2h-6.6v17.2h31v-17.2h-6.6v-52.5h6.6v-17.3z" />
    <path d="M27.4,66h36.9v17.1h-4.5l23,53h9.4v17.1h-33.5v-17h5l-3.7,-8.8h-27.6l-3.7,8.8h5v17.1h-33.5v-17.1h9.4l23,-53h-5v-17.1zM46.2,95.5l-6.5,14.8h13z" />
    <path d="M27.4,0h191v54.7h-37.6v-20.7h-39.5v130.7h21v37.3h-79.2v-37.3h21v-130.7h-39.5v20.7h-37.6v-54.7z" />
    <path d="M34.5,7.7h172.4l-10.4,8h-153.8z" fill="none" />
    <path d="M125.7,18.5l7.9,7..."></path>
  </svg>
);

const Footer: React.FC = () => {
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="container mx-auto flex min-h-[50vh] flex-col px-2 py-6 sm:px-4 sm:py-8 md:px-4 md:py-12">
        <div className="mb-12 flex flex-grow flex-col items-start justify-between lg:flex-row">
          <div className="mb-8 w-full lg:mb-0 lg:w-1/3">
            <p className="font-dm-sans mb-4 font-bold text-[#949494]">
              Think. Take the Moment.
            </p>
            <button
              className="transform rounded-full bg-white px-6 py-3 text-[#1A1A1A] transition duration-300 hover:scale-105 hover:bg-gray-200"
              onClick={() => {
                window.location.href = "https://discord.gg/qUAuSraYV9";
              }}
            >
              Join Us
            </button>
          </div>
          <div className="order-3 -mt-4 w-full lg:order-2 lg:-mt-8 lg:w-1/3">
            <ContactForm />
          </div>
          <div className="order-2 -mt-20 mb-8 w-full self-end lg:order-3 lg:-mt-4 lg:mb-0 lg:w-1/4 lg:self-start">
            <ul className="mt-0 space-y-2 md:mt-[-8px] lg:mt-0">
              <li className="flex items-center justify-end">
                <button
                  onClick={() => router.push("/about")}
                  className="flex items-center text-[#949494] transition duration-300 hover:text-white"
                >
                  About
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </li>
              <li className="flex items-center justify-end">
                <button
                  onClick={() => router.push("/challenges")}
                  className="flex items-center text-[#949494] transition duration-300 hover:text-white"
                >
                  Challenges
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </li>
              <li className="flex items-center justify-end">
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center text-[#949494] transition duration-300 hover:text-white"
                >
                  Home
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </li>
              <li className="flex items-center justify-end">
                <button
                  onClick={scrollToBottom}
                  className="flex items-center text-[#949494] transition duration-300 hover:text-white"
                >
                  Contact
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col items-start justify-between lg:flex-row lg:items-end">
          <div className="flex w-full flex-col items-start lg:items-start">
            <div className="mb-4 flex w-full items-center justify-start lg:mb-0">
              <div className="lg:-ml-25 relative flex items-center">
                <div className="relative">
                  <div className="absolute -left-6 -top-10 hidden origin-bottom-right -rotate-90 transform text-lg font-bold text-[#949494] sm:-left-8 sm:-top-12 sm:block sm:text-xl md:-left-10 md:-top-16 md:text-2xl lg:-left-20 lg:-top-20 lg:ml-5 lg:text-3xl xl:ml-5">
                    TAMU
                  </div>
                </div>
                <h2 className="font-poppins ml-4 text-4xl font-bold text-[#949494] sm:ml-5 sm:text-5xl md:ml-6 md:text-6xl lg:ml-7 lg:text-8xl xl:ml-7">
                  ThinkTank
                </h2>
              </div>
              <button
                onClick={scrollToTop}
                className="group ml-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#949494] transition-all duration-300 hover:bg-white sm:h-9 sm:w-9 md:ml-6 md:h-10 md:w-10 lg:ml-12"
              >
                <ArrowUp className="h-6 w-6 text-[#949494] transition-colors duration-300 group-hover:text-[#1A1A1A]" />
              </button>
            </div>
            <div className="flex w-full flex-col items-end lg:flex-row lg:justify-between">
              <div className="order-1 mb-2 flex space-x-2 sm:space-x-3 md:space-x-4 lg:mb-0">
                <a
                  href="https://discord.gg/qUAuSraYV9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <FaDiscord size={24} />
                </a>
                <a
                  href="https://getinvolved.tamu.edu/org/thinktank"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <TAMULogo width={24} height={24} />
                </a>
                <a
                  href="https://www.instagram.com/tamuthinktank/"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/company/tamu-thinktank"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <Linkedin size={24} />
                </a>
              </div>
              <p className="font-dm-sans order-2 text-[10px] font-bold text-[#949494] sm:text-xs">
                Developed and Designed by Lucas Vadlamudi, Jeremy Tran, Tanish
                Bandari, Nithish Mohan, and James Bryant
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
