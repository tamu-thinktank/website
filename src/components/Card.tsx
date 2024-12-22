"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface CardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  color: string;
}

export default function Card({ i, title, description, src, color }: CardProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [2, 1]);

  return (
    <div
      ref={container}
      className="sticky top-1/2 mt-[50vh] flex min-h-[400px] -translate-y-1/2 transform items-center justify-center"
    >
      <div
        style={{ backgroundColor: color, top: `calc(${i * 50}px)` }}
        className="transform-origin-top relative flex min-h-[400px] w-[90vw] max-w-6xl flex-col px-[20px] py-[0px]"
      >
        {i !== 0 && (
          <hr className="border-t-2 border-gray-300 dark:border-gray-600" />
        )}
        <h2 className="m-1 text-2xl font-semibold text-gray-400 md:text-3xl">
          {title}
        </h2>
        <div className="mt-12 flex h-full flex-col gap-12 md:flex-row">
          <div className="relative hidden h-[300px] w-full overflow-hidden rounded-2xl md:block md:w-2/5">
            <motion.div style={{ scale }} className="relative h-full w-full">
              <Image
                fill
                src={`/images/cardstack/${src}`}
                alt="image"
                className="object-cover"
              />
            </motion.div>
          </div>
          <div className="relative top-0 w-full md:w-3/5">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
