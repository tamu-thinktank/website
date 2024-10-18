"use client";
import Link from "next/link";
import Container from "../../components/Container";
import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import {
  SiDiscord,
  SiFacebook,
  SiInstagram,
  SiLinkedin,
} from "@icons-pack/react-simple-icons";

const scrollItems = [
  "Industry Experience",
  "Cooperative Atmosphere",
  "Personal Empowerment",
  "Hands-on Learning",
  "Networking Opportunities",
];

const socialLinks = [
  {
    name: "Discord",
    url: "https://discord.gg/your-discord-link",
    icon: SiDiscord,
  },
  { name: "Facebook", url: "https://facebook.com/your-page", icon: SiFacebook },
  {
    name: "Instagram",
    url: "https://instagram.com/your-profile",
    icon: SiInstagram,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/your-company",
    icon: SiLinkedin,
  },
];

export default function HeroSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const containerWidth = scrollContainer.offsetWidth;

    let scrollPosition = 0;
    const scrollSpeed = 50;

    const scroll = () => {
      scrollPosition += 1;
      if (scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }, []);

  useEffect(() => {
    const arrow = arrowRef.current;
    if (!arrow) return;

    const animate = () => {
      arrow.animate(
        [
          { transform: "translateY(0px)", opacity: 0.5 },
          { transform: "translateY(10px)", opacity: 1 },
          { transform: "translateY(0px)", opacity: 0.5 },
        ],
        {
          duration: 2000,
          iterations: Infinity,
          easing: "ease-in-out",
        },
      );
    };

    animate();
  }, []);

  return (
    <div className="relative bg-[#0C0D0E]" id="home">
      <div className="pointer-events-none absolute right-0 top-0 h-1/2 w-1/2 -translate-y-1/3 translate-x-1/3 transform rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
      <Container>
        <div className="relative mx-auto flex h-screen flex-col justify-center">
          <div className="mx-auto w-full text-center lg:w-4/5 xl:w-3/4 2xl:w-2/3">
            <h1 className="mb-1 bg-gradient-to-r from-white via-white to-blue-900 bg-clip-text pb-1 text-5xl font-bold leading-tight text-transparent sm:mb-3 sm:text-6xl md:text-7xl lg:text-8xl xl:text-7xl 2xl:text-7xl 2xl:leading-tight">
              Empowering
            </h1>
            <h1 className="mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text pb-1 text-5xl font-bold leading-tight text-transparent sm:mb-6 sm:text-6xl md:text-7xl lg:text-8xl xl:text-7xl 2xl:text-7xl 2xl:leading-tight">
              Future Engineers
            </h1>

            <p className="mx-auto max-w-3xl text-base text-gray-400 sm:text-lg md:text-xl lg:text-xl xl:text-lg 2xl:text-xl">
              From Potential to Professional,
            </p>
            <p className="mx-auto mb-6 mt-1 max-w-3xl text-base text-gray-400 sm:mb-12 sm:text-lg md:text-xl lg:text-xl xl:text-lg 2xl:text-xl">
              start your journey with ThinkTank
            </p>

            <div className="mb-8 flex flex-wrap justify-center gap-x-4 gap-y-4 sm:mb-16 sm:gap-x-6">
              <a
                href="https://discord.gg/qUAuSraYV9"
                className="relative flex h-10 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:h-11 sm:w-56 md:w-64 lg:h-12 lg:w-72 xl:h-14 xl:w-80"
              >
                <span className="relative text-sm font-semibold text-black sm:text-base lg:text-lg xl:text-xl">
                  Join Us
                </span>
              </a>
              <a
                href="apply"
                className="relative flex h-10 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:border before:border-gray-700 before:bg-gray-800 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:h-11 sm:w-56 md:w-64 lg:h-12 lg:w-72 xl:h-14 xl:w-80"
              >
                <span className="relative text-sm font-semibold text-white sm:text-base lg:text-lg xl:text-xl">
                  Contact Us
                </span>
              </a>
            </div>

            <div className="mb-6 flex justify-center space-x-4 sm:mb-12 sm:space-x-6 lg:space-x-8">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform text-gray-400 transition-transform duration-300 hover:scale-125 hover:text-white"
                >
                  <link.icon className="h-4.5 w-4.5 lg:h-7.5 lg:w-7.5 2xl:h-10.5 2xl:w-10.5 sm:h-6 sm:w-6 xl:h-9 xl:w-9" />
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </div>

            <div className="relative overflow-hidden border-y border-gray-700 py-4 sm:py-6 lg:py-8">
              <div className="absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-[#0C0D0E] to-transparent"></div>
              <div className="absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-[#0C0D0E] to-transparent"></div>
              <div
                ref={scrollRef}
                className="inline-block whitespace-nowrap"
                style={{ willChange: "transform" }}
              >
                {[...scrollItems, ...scrollItems].map((item, index) => (
                  <span
                    key={index}
                    className="inline-block px-4 text-base font-semibold text-gray-300 sm:px-8 sm:text-lg lg:text-xl xl:text-2xl"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            ref={arrowRef}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 transform sm:bottom-8"
          >
            <ChevronDown className="h-6 w-6 text-white sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12" />
          </div>
        </div>
      </Container>
    </div>
  );
}
