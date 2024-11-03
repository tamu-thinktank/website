"use client";

import React from "react";
import ContactForm from "./ContactForm";
import {
  ArrowUpRight,
  ArrowUp,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="container mx-auto flex min-h-[50vh] flex-col px-4 py-12">
        <div className="mb-12 flex flex-grow flex-col items-start justify-between lg:flex-row">
          <div className="mb-8 w-full lg:mb-0 lg:w-1/3">
            <p className="font-dm-sans mb-4 font-bold text-[#949494]">
              Think. Take the Moment.
            </p>
            <button className="transform rounded-full bg-white px-6 py-3 text-[#1A1A1A] transition duration-300 hover:scale-105 hover:bg-gray-200">
              Join Us
            </button>
          </div>
          <div className="order-3 -mt-4 w-full lg:order-2 lg:-mt-8 lg:w-1/3">
            <ContactForm />
          </div>
          <div className="order-2 -mt-20 mb-8 w-full self-end lg:order-3 lg:-mt-4 lg:mb-0 lg:w-1/4 lg:self-start">
            <ul className="mt-0 space-y-2 lg:mt-0">
              {["About", "Projects", "Team", "Contact"].map((item) => (
                <li key={item} className="flex items-center justify-end">
                  <a
                    href="#"
                    className="flex items-center text-[#949494] transition duration-300 hover:text-white"
                  >
                    {item}
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col items-start justify-between lg:flex-row lg:items-end">
          <div className="flex w-full flex-col items-start lg:items-start">
            <div className="mb-4 flex w-full items-center justify-start lg:mb-0">
              <div className="relative flex items-center lg:-ml-16">
                <div className="relative">
                  <div className="absolute -left-6 -top-10  origin-bottom-right -rotate-90 transform text-sm font-bold text-[#949494] lg:-left-28 lg:-top-20 lg:text-3xl">
                    TAMU
                  </div>
                </div>
                <h2 className="font-poppins ml-4 text-[3.2rem] font-bold text-[#949494] lg:left-20 lg:ml-4 lg:-translate-x-8 lg:text-8xl">
                  ThinkTank
                </h2>
              </div>
              <button
                onClick={scrollToTop}
                className="group ml-8 flex h-10 w-10 items-center justify-center rounded-full border border-[#949494] transition-all duration-300 hover:bg-white lg:-translate-x-8"
              >
                <ArrowUp className="h-6 w-6 text-[#949494] transition-colors duration-300 group-hover:text-[#1A1A1A]" />
              </button>
            </div>
            <div className="flex w-full flex-col items-end lg:flex-row lg:justify-between">
              <div className="order-1 mb-2 flex space-x-4 lg:mb-0">
                <a
                  href="#"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <FaDiscord size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#949494] transition-colors duration-300 hover:text-white"
                >
                  <Linkedin size={24} />
                </a>
              </div>
              <p className="font-dm-sans order-2 text-xs font-bold text-[#949494]">
                developed and designed by xyz
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
