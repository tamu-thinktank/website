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
    url: "https://discord.gg/qUAuSraYV9",
    icon: SiDiscord,
    size: 1.05,
  },
  {
    name: "Facebook",
    url: "https://getinvolved.tamu.edu/org/thinktank",
    icon: SiFacebook,
    size: 1.02,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/tamuthinktank/",
    icon: SiInstagram,
    size: 1,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/tamu-thinktank",
    icon: SiLinkedin,
    size: 1,
  },
];

export default function MyComponent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    let scrollPosition = 0;
    let animationId: number;

    const scroll = () => {
      scrollPosition += 1;
      if (scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    const arrow = arrowRef.current;
    if (!arrow) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerBottom = container.getBoundingClientRect().bottom;
      const viewportHeight = window.innerHeight;

      if (containerBottom < viewportHeight) {
        arrow.style.position = "absolute";
        arrow.style.bottom = "8px";
      } else {
        arrow.style.position = "fixed";
        arrow.style.bottom = "32px";
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToBottom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0C0D0E]"
      id="home"
      ref={containerRef}
    >
      <div className="pointer-events-none absolute right-[-125px] top-[-375px] h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/2 transform bg-blue-400 opacity-10 blur-3xl md:h-[1250px] md:w-[1250px] lg:h-[1500px] lg:w-[1500px]"></div>

      <div className="flex min-h-screen items-center justify-center py-5 md:py-12">
        <Container>
          <div className=" relative mx-auto flex flex-col justify-center overflow-visible pt-0 sm:pt-16">
            <div className="mx-auto w-full text-center lg:w-4/5 xl:w-3/4 2xl:w-2/3">
              <div className="relative pt-5 sm:pt-20">
                <h1 className="font-poppins relative z-[9999] mb-1 w-full bg-gradient-to-r from-white to-[#617B7F] bg-clip-text text-[7.2em] font-semibold leading-relaxed text-transparent sm:text-[4em] md:text-[5em] lg:text-[6em]">
                  Empowering
                </h1>
                <h2 className="font-poppins relative z-[9999] mb-1 mt-[-0.2em] w-full whitespace-nowrap bg-gradient-to-r from-white to-gray-500 bg-clip-text text-[7em] font-semibold leading-relaxed text-transparent sm:text-[4em] md:text-[5em] lg:text-[6em]">
                  Future Engineers
                </h2>
              </div>

              <div className="space-y-0">
                <p className="font-dm-sans mx-auto max-w-3xl text-[2em] text-[#B8B8B8] sm:text-[1.5em]">
                  From Potential to Professional
                </p>
                <p className="font-dm-sans mx-auto mb-1 max-w-3xl text-[2em] text-[#B8B8B8] sm:mb-8 sm:text-[1.5em]">
                  Start Your Journey with ThinkTank
                </p>
              </div>

              <div className="mb-8 flex flex-col items-center gap-y-4 pt-8 sm:mb-16 sm:flex-row sm:justify-center sm:gap-x-6">
                <Link
                  href="/apply"
                  className="group relative flex h-20 w-[90%] max-w-[23rem] items-center justify-center rounded-full bg-primary px-7 text-2xl font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95 sm:h-14 sm:w-48 sm:text-base lg:h-16 lg:w-64 lg:text-xl xl:h-[4.5rem] xl:w-72 xl:text-2xl"
                >
                  Apply
                </Link>
                <a
                  href="#"
                  onClick={scrollToBottom}
                  className="flex h-20 w-[90%] max-w-[23rem] items-center justify-center rounded-full border-2 border-white bg-transparent px-7 text-2xl font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black active:scale-95 sm:h-14 sm:w-48 sm:text-base lg:h-16 lg:w-64 lg:text-xl xl:h-[4.5rem] xl:w-72 xl:text-2xl"
                >
                  Contact Us
                </a>
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
                      className="h-10 w-10 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12"
                      style={{
                        transform: `scale(${link.size})`,
                      }}
                    />
                    <span className="sr-only">{link.name}</span>
                  </a>
                ))}
              </div>

              <div className="my-4 border-t border-white opacity-20"></div>
              <div className="relative overflow-hidden border-y border-[#0C0D0E] py-4 sm:py-6 lg:py-8">
                <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-[#0C0D0E] to-transparent sm:w-40"></div>
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-[#0C0D0E] to-transparent sm:w-40"></div>

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
      <div
        ref={arrowRef}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 transform"
      >
        <ChevronDown className="h-8 w-8 animate-bounce text-white" />
      </div>
    </div>
  );
}
