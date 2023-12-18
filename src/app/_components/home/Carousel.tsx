"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const orgImages = [
  "/images/photos/20230119_180722.webp",
  "/images/photos/20230119_181122.webp",
  "/images/photos/20230119_181127.webp",
  "/images/photos/20230119_181204.webp",
  "/images/photos/20230119_181219.webp",
  "/images/photos/20230119_181249.webp",
  "/images/photos/20230119_181722.webp",
  "/images/photos/70354378340__2697ED96-1234-438F-9107-3D0A08A82467.webp",
  "/images/photos/IMG_5627.webp",
  "/images/photos/IMG_5628.webp",
  "/images/photos/IMG_5635.webp",
  "/images/photos/IMG_5675.webp",
  "/images/photos/IMG_5692.webp",
  "/images/photos/IMG_5695.webp",
  "/images/photos/IMG_5711.webp",
  "/images/photos/IMG_5722.webp",
  "/images/photos/IMG_5723.webp",
  "/images/photos/IMG_5736.webp",
  "/images/photos/IMG_5741.webp",
  "/images/photos/IMG_5745.webp",
  "/images/photos/IMG_5754.webp",
  "/images/photos/IMG_5786.webp",
  "/images/photos/IMG_5838.webp",
  "/images/photos/IMG_5856.webp",
  "/images/photos/IMG_5861.webp",
  "/images/photos/IMG_5882.webp",
  "/images/photos/IMG_5996.webp",
  "/images/photos/IMG_6116.webp",
  "/images/photos/IMG_6117.webp",
  "/images/photos/IMG_6119.webp",
  "/images/photos/IMG_6121.webp",
]

function shuffleArray(array: (string | undefined)[]) {
  const shuffled: typeof array = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.filter(Boolean);
}

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const images = useMemo(() => shuffleArray(orgImages), []);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1,
        ),
      3000,
    );

    return () => resetTimeout();
  }, [index]);

  return (
    <div className="mx-auto flex overflow-hidden">
      <div
        className="whitespace-nowrap transition-all duration-1000 ease-in-out"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className={`inline-block h-full w-full`}>
            <Image
              src={img}
              alt="client logo"
              className="mx-auto h-auto w-11/12"
              width={0}
              height={0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
