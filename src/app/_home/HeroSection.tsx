"use client";

import Link from "next/link";
import Container from "../../components/Container";
import { useRef, useEffect } from "react";
import {
  SiDiscord,
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

const TAMUlogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    icon: TAMUlogo,
    size: 1.15,
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
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerBottom = container.getBoundingClientRect().bottom;
      const viewportHeight = window.innerHeight;

      if (containerBottom < viewportHeight) {
        container.classList.add("absolute");
        container.classList.remove("fixed");
      } else {
        container.classList.add("fixed");
        container.classList.remove("absolute");
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
          <div className="landing-page-container relative mx-auto flex flex-col justify-center overflow-visible pt-0 sm:pt-16">
            <div className="mx-auto w-full text-center lg:w-4/5 xl:w-3/4 2xl:w-2/3">
              <div className="relative pt-5 sm:pt-20">
                <h1 className="font-poppins relative z-[3] mb-2 w-full bg-gradient-to-r from-white to-[#617B7F] bg-clip-text pb-2 text-5xl font-semibold leading-[1.2] text-transparent sm:text-6xl md:text-7xl lg:text-[5em]">
                  Empowering
                </h1>
                <h2 className="font-poppins relative z-[3] mb-1 mt-1 w-full whitespace-nowrap bg-gradient-to-r from-white to-gray-500 bg-clip-text pb-2 text-5xl font-semibold leading-[1.2] text-transparent sm:text-6xl md:text-7xl lg:text-[5em]">
                  Future Engineers
                </h2>
              </div>

              <div className="mt-2 flex flex-col -space-y-2 sm:-space-y-3 lg:-space-y-4">
                <p className="font-dm-sans mx-auto max-w-3xl text-xl text-[#B8B8B8] sm:text-2xl lg:text-[1.5em]">
                  From Potential to Professional
                </p>
                <p className="font-dm-sans mx-auto max-w-3xl text-xl text-[#B8B8B8] sm:text-2xl lg:text-[1.5em]">
                  Start Your Journey with ThinkTank
                </p>
              </div>

              <div className="mb-8 flex flex-col items-center gap-y-4 pt-8 sm:mb-16 sm:flex-row sm:justify-center sm:gap-x-6">
                <Link
                  href="/apply"
                  className="group relative flex h-14 w-full max-w-[20rem] items-center justify-center rounded-full bg-primary px-7 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95 sm:h-14 sm:w-48 sm:text-base lg:h-16 lg:w-64 lg:text-xl xl:h-[4.5rem] xl:w-72 xl:text-2xl"
                >
                  Apply
                </Link>
                <a
                  href="#"
                  onClick={scrollToBottom}
                  className="flex h-14 w-full max-w-[20rem] items-center justify-center rounded-full border-2 border-white bg-transparent px-7 text-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black active:scale-95 sm:h-14 sm:w-48 sm:text-base lg:h-16 lg:w-64 lg:text-xl xl:h-[4.5rem] xl:w-72 xl:text-2xl"
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
                    className="transform text-gray-300 transition-all duration-300 ease-in-out will-change-transform hover:scale-110 hover:text-white"
                  >
                    <link.icon
                      className="h-8 w-8 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12"
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
    </div>
  );
}
