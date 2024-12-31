"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Container from "../../components/Container";
import { useRouter } from "next/navigation";

const logos = [
  "/images/clients/aero.webp",
  "/images/clients/aiaa.webp",
  "/images/clients/herox.webp",
  "/images/clients/rascal.webp",
  "/images/clients/tsgc.webp",
];

function LogoSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideWidth = ((slider.scrollWidth / logos.length) * 1) / 2;
    const animationDuration = 15000;

    const animation = slider.animate(
      [
        { transform: "translateX(0)" },
        { transform: `translateX(-${slideWidth * logos.length}px)` },
      ],
      {
        duration: animationDuration,
        iterations: Infinity,
        easing: "linear",
      },
    );

    return () => {
      animation.cancel();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div ref={sliderRef} className="flex">
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex-shrink-0 px-4">
            <Image
              src={logo}
              alt={``}
              width={100}
              height={50}
              background-size="contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChallengeSection() {
  const router = useRouter();
  return (
    <div id="travel" className="bg-[#0C0D0E] py-8 md:py-12">
      <Container>
        <div className="flex flex-col-reverse items-start justify-between space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="w-full space-y-8 lg:w-1/2 lg:pt-0">
            <h2 className="text-2xl font-bold italic text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
              <span style={{ color: "#B8B8B8" }}>Design Challenges</span>
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 sm:text-base md:text-lg">
              <p>
                ThinkTank teams compete in capstone-level engineering
                competitions by designing solutions for significant present and
                future challenges. Each member learns to solve complex problems,
                develop critical subsystems, and integrate their solutions
                within a cohesive team environment.
              </p>
            </div>
            <div className="my-8 border-t border-gray-700"></div>
            <div className="space-y-6">
              <LogoSlider />
            </div>
            <div className="my-8 border-t border-gray-700"></div>
            <div className="pt-4">
              <button
                onClick={() => router.push("/challenges")}
                className="w-full transform rounded-full border border-white bg-transparent px-6 py-3 text-base text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black sm:text-lg"
              >
                Explore Challenges
              </button>
            </div>
          </div>
          <div className="mb-8 w-full pb-8 md:mb-12 md:pb-0 lg:w-1/2">
            <Image
              src="/images/photos/IMG_6121.webp"
              alt="Design Challenge"
              className="w-full rounded-lg object-cover"
              width={600}
              height={400}
              layout="responsive"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
