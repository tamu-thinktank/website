"use client";

import React, { useRef, useEffect } from "react";
import Container from "../../components/Container";
import gsap from "gsap";

interface BenefitBoxProps {
  title: string;
}

function BenefitBox({ title }: BenefitBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boxRef.current || !imageRef.current) return;

    const box = boxRef.current;
    const image = imageRef.current;

    const tl = gsap.timeline({ paused: true });

    tl.to(image, {
      duration: 1.2,
      scale: 1.2,
      y: "-2%",
      ease: "power2.out",
    });

    const handleMouseEnter = () => tl.play();
    const handleMouseLeave = () => tl.reverse(0.3); // Faster reverse animation

    box.addEventListener("mouseenter", handleMouseEnter);
    box.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      box.removeEventListener("mouseenter", handleMouseEnter);
      box.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const words = title.split(" ");
  const firstWord = words[0];
  const boldWords = words.slice(1, 4).join(" ");
  const remainingWords = words.slice(4).join(" ");

  return (
    <div
      ref={boxRef}
      className="group relative h-[300px] sm:h-[350px] md:h-[400px]"
    >
      <div className="absolute inset-0 bg-white opacity-0 blur-xl transition-opacity duration-500 ease-in-out group-hover:opacity-10"></div>

      <div className="relative h-full overflow-hidden rounded-2xl bg-[#1A1A1A] p-6">
        <div className="absolute inset-0 rounded-2xl border-2 border-[#535151] opacity-50"></div>
        <div className="relative flex h-full flex-col">
          <div
            ref={imageRef}
            className="absolute inset-x-0 top-0 h-[70%] overflow-hidden rounded-lg"
            style={{ width: "100%" }}
          >
            <div className="h-full w-full bg-gray-700"></div>
          </div>
          <h3 className="mt-auto pb-4 pl-6 text-left text-lg font-semibold text-white sm:text-xl md:text-2xl">
            <span className="block font-normal">{firstWord}</span>{" "}
            <span className="block font-semibold">{boldWords}</span>{" "}
            {remainingWords && (
              <span className="block font-normal">{remainingWords}</span>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}

const MemoizedBenefitBox = React.memo(BenefitBox);

export default function Benefits() {
  return (
    <section className="bg-[#0C0D0E] py-12 sm:py-16 md:py-20 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <MemoizedBenefitBox title="Gain Real World Experience" />
          <MemoizedBenefitBox title="Turn Ideas Into Reality" />
          <MemoizedBenefitBox title="Travel Across The World" />
        </div>
      </Container>
    </section>
  );
}
