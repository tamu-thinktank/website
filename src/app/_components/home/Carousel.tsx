"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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
const delay = 3000;

function shuffleArray<T>(array: (T | undefined)[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (array[i] !== undefined && array[j] !== undefined) {
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [])

  // Shuffle the array when the component mounts
  useEffect(() => {
    shuffleArray(orgImages);
  }, []);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === orgImages.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => resetTimeout();
  }, [index]);

  return (
    <div className="mx-auto w-2/3 flex overflow-hidden">
      <div className="w-screen whitespace-nowrap transition-all ease-in-out duration-1000" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
        {orgImages.map((img, idx) => (
          <div key={idx} className={`inline-block h-full w-full`}>
            <Image src={img} alt="client logo" className="mx-auto h-auto w-9/12" width={0} height={0}/>
          </div>
        ))}
      </div>
    </div>
  )
}