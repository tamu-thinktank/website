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
  "Internship Opportunities",
  "Skill Development",
  "Interdisciplinary Teams",
  "Peer Mentors",
  "Creative Solutions",
  "Project Leadership",
  "Systems Engineering",
  "Faculty Mentors ",
  "Professional Presentations",
];

const socialLinks = [
  {
    name: "Discord",
    url: "https://discord.gg/your-discord-link",
    icon: SiDiscord,
    size: 1.05, // 5% bigger
  },
  {
    name: "Facebook",
    url: "https://facebook.com/your-page",
    icon: SiFacebook,
    size: 1.02, // 2% bigger
  },
  {
    name: "Instagram",
    url: "https://instagram.com/your-profile",
    icon: SiInstagram,
    size: 1, // default size
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/your-company",
    icon: SiLinkedin,
    size: 1, // default size
  },
];

export default function MyComponent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const containerWidth = scrollContainer.offsetWidth;

    let scrollPosition = 0;
    let animationId: number;

    const scroll = () => {
      scrollPosition += 1;
      if (scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0;
        scrollContainer.style.transition = "none";
        scrollContainer.style.transform = `translateX(0px)`;
        void scrollContainer.offsetWidth; // Trigger reflow
        scrollContainer.style.transition = "transform 0.5s linear";
      }
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const arrow = arrowRef.current;
    if (!arrow) return;

    const animate = () => {
      arrow.animate(
        [
          { transform: "translateY(0px)" },
          { transform: "translateY(5px)" },
          { transform: "translateY(0px)" },
        ],
        {
          duration: 5000000,
          iterations: Infinity,
          easing: "ease-in-out",
        },
      );
    };

    animate();
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0C0D0E]"
      id="home"
    >
      <div className="pointer-events-none absolute right-[-125px] top-[-375px] h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/2 transform bg-blue-400 opacity-10 blur-3xl md:h-[1250px] md:w-[1250px] lg:h-[1500px] lg:w-[1500px]"></div>

      <div className="flex min-h-screen items-center justify-center py-5 md:py-12">
        <Container>
          <div className="desktop-scale mobile-adjust relative mx-auto flex flex-col justify-center pt-16">
            <div className="mx-auto w-full text-center lg:w-4/5 xl:w-3/4 2xl:w-2/3">
              <div className="relative">
                <h1 className="responsive-title font-poppins relative z-[3000] mb-1 w-full bg-gradient-to-r from-white to-[#617B7F] bg-clip-text font-semibold leading-tight text-transparent">
                  Empowering
                </h1>
                <h2 className="responsive-title font-poppins relative z-[3000] mb-1 mt-[-0.2em] w-full bg-gradient-to-r from-white to-gray-500 bg-clip-text font-semibold leading-tight text-transparent">
                  Future Engineers
                </h2>
              </div>

              <div className="space-y-0">
                <p className="font-dm-sans mx-auto max-w-3xl text-[1.5em] text-[#B8B8B8] sm:text-[1.5em] md:text-[1.5em] lg:text-[1.5em] xl:text-[1.5em]">
                  From Potential to Professional
                </p>
                <p className="font-dm-sans mx-auto mb-1 max-w-3xl text-[1.5em] text-[#B8B8B8] sm:mb-8 sm:text-[1.5em] md:text-[1.5em] lg:text-[1.5em] xl:text-[1.5em] ">
                  Start Your Journey with ThinkTank
                </p>
              </div>

              <div className="mb-8 flex flex-col items-center gap-y-4 pt-8 sm:mb-16 sm:flex-row sm:justify-center sm:gap-x-6">
                <Link
                  href="https://discord.gg/qUAuSraYV9"
                  className="group relative flex h-14 w-[85%] max-w-[20rem] items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95 sm:h-12 sm:w-48 sm:text-sm lg:h-14 lg:w-56 lg:text-lg xl:h-16 xl:w-64 xl:text-xl"
                >
                  Apply
                </Link>
                <Link
                  href="/"
                  className="flex h-14 w-[85%] max-w-[20rem] items-center justify-center rounded-full border-2 border-white bg-transparent px-6 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black active:scale-95 sm:h-12 sm:w-48 sm:text-sm lg:h-14 lg:w-56 lg:text-lg xl:h-16 xl:w-64 xl:text-xl"
                >
                  Contact Us
                </Link>
              </div>

              <div className="mb-6 flex justify-center space-x-4 sm:mb-12 sm:space-x-6 lg:space-x-8">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transform text-gray-300 transition-all duration-300 ease-in-out will-change-transform hover:scale-125 hover:text-white"
                  >
                    <link.icon
                      className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12"
                      style={{
                        transform: `scale(${link.size})`,
                      }}
                    />
                    <span className="sr-only">{link.name}</span>
                  </a>
                ))}
              </div>

              <div className="my-4 border-t border-white opacity-20"></div>
              <div
                className="relative overflow-hidden border-y border-[#0C0D0E] py-4 sm:py-6 lg:py-8"
                style={{ margin: "20px 0" }}
              >
                <div className="pointer-events-none absolute bottom-0 left-[0px] top-0 z-10 w-36 bg-gradient-to-r from-[#0C0D0E] to-transparent"></div>
                <div className="pointer-events-none absolute bottom-0 right-[-5px] top-0 z-10 w-36 bg-gradient-to-l from-[#0C0D0E] to-transparent"></div>

                <div
                  ref={scrollRef}
                  className="inline-block whitespace-nowrap"
                  style={{ willChange: "transform" }}
                >
                  {[...scrollItems, ...scrollItems].map((item, index) => (
                    <span
                      key={index}
                      className="font-dm-sans inline-block px-4 text-sm font-semibold text-gray-300 sm:px-8 sm:text-base lg:text-lg xl:text-xl"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
        <ChevronDown className="h-8 w-8 animate-bounce text-white" />
      </div>
    </div>
  );
}
