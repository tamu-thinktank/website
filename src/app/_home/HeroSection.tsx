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

export default function MyComponent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const containerWidth = scrollContainer.offsetWidth;

    let scrollPosition = 0;

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
    <div
      className="relative overflow-hidden bg-[#0C0D0E]"
      id="home"
      style={{
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      }}
    >
      <div className="pointer-events-none absolute right-[-125px] top-[-375px] h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/2 transform bg-blue-400 opacity-10 blur-3xl md:h-[1250px] md:w-[1250px] lg:h-[1500px] lg:w-[1500px]"></div>

      <div className="flex min-h-screen items-center py-5 md:py-12">
        <Container>
          <div className="desktop-scale mobile-adjust relative mx-auto flex flex-col justify-center">
            <div className="mx-auto w-full text-center lg:w-4/5 xl:w-3/4 2xl:w-2/3">
              <div className="font-poppins 3xl:top-12 3xl:pt-8 relative top-8 w-full bg-gradient-to-r from-white to-[#000080] bg-clip-text pt-0.5 text-[650%] font-semibold leading-snug text-transparent max-md:max-w-full max-md:text-4xl">
                Empowering
              </div>

              <div className="font-poppins -mt-4 w-full bg-gradient-to-r from-white to-gray-500 bg-clip-text text-[650%] font-semibold text-transparent max-md:max-w-full max-md:text-4xl">
                Future Engineers
              </div>

              <p
                className="mx-auto max-w-3xl text-sm text-gray-200 sm:text-base md:text-lg lg:text-xl xl:text-2xl"
                style={{ lineHeight: "1.3" }}
              >
                From Potential to Professional
              </p>
              <p className="mx-auto mb-6 mt-1 max-w-3xl text-sm text-gray-200 sm:mb-12 sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                Start Your Journey with ThinkTank
              </p>

              <div className="mb-8 flex flex-wrap justify-center gap-x-4 gap-y-4 sm:mb-16 sm:gap-x-6">
                <a
                  href="https://discord.gg/qUAuSraYV9"
                  className="group relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-48 lg:h-12 lg:w-56 xl:h-14 xl:w-64"
                >
                  <span className="relative text-sm font-semibold text-black transition-all duration-300 ease-in-out will-change-transform group-hover:scale-110 sm:text-base lg:text-lg xl:text-xl">
                    Join Us
                  </span>
                </a>
                <a
                  href="apply"
                  className="contact-us-btn group relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-white before:bg-transparent before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-48 lg:h-12 lg:w-56 xl:h-14 xl:w-64"
                >
                  <span className="relative text-sm font-semibold text-white transition-all duration-300 ease-in-out will-change-transform group-hover:scale-110 sm:text-base lg:text-lg xl:text-xl">
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
                    className="transform text-gray-300 transition-all duration-300 ease-in-out will-change-transform hover:scale-125 hover:text-white"
                  >
                    <link.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10" />
                    <span className="sr-only">{link.name}</span>
                  </a>
                ))}
              </div>

              <div className="my-4 border-t border-white opacity-20"></div>
              <div
                className="relative overflow-hidden border-y border-[#0C0D0E] py-4 sm:py-6 lg:py-8"
                style={{ margin: "20px 0" }}
              >
                <div className="absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-[#0C0D0E] to-transparent"></div>
                <div className="from absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l"></div>
                <div
                  ref={scrollRef}
                  className="inline-block whitespace-nowrap"
                  style={{ willChange: "transform" }}
                >
                  {[...scrollItems, ...scrollItems].map((item, index) => (
                    <span
                      key={index}
                      className="inline-block px-4 text-sm font-semibold text-gray-300 sm:px-8 sm:text-base lg:text-lg xl:text-xl"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div
              ref={arrowRef}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 transform sm:-bottom-16 lg:-bottom-20 xl:-bottom-24"
            >
              <ChevronDown className="h-6 w-6 text-white sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12" />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
