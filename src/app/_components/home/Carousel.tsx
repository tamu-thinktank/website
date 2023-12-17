"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const orgImages = [
  "/images/photos/20230119_180722.jpg",
  "/images/photos/20230119_181122.jpg",
  "/images/photos/20230119_181127.jpg",
  "/images/photos/20230119_181204.jpg",
  "/images/photos/20230119_181219.jpg",
  "/images/photos/20230119_181249.jpg",
  "/images/photos/20230119_181722.jpg",
  "/images/photos/70354378340__2697ED96-1234-438F-9107-3D0A08A82467.jpg",
  "/images/photos/IMG_5627.jpg",
  "/images/photos/IMG_5628.jpg",
  "/images/photos/IMG_5635.jpg",
  "/images/photos/IMG_5675.jpg",
  "/images/photos/IMG_5692.jpg",
  "/images/photos/IMG_5695.jpg",
  "/images/photos/IMG_5711.jpg",
  "/images/photos/IMG_5722.jpg",
  "/images/photos/IMG_5723.jpg",
  "/images/photos/IMG_5736.jpg",
  "/images/photos/IMG_5741.jpg",
  "/images/photos/IMG_5745.jpg",
  "/images/photos/IMG_5754.jpg",
  "/images/photos/IMG_5786.jpg",
  "/images/photos/IMG_5838.jpg",
  "/images/photos/IMG_5856.jpg",
  "/images/photos/IMG_5861.jpg",
  "/images/photos/IMG_5882.jpg",
  "/images/photos/IMG_5996.jpg",
  "/images/photos/IMG_6116.JPG",
  "/images/photos/IMG_6117.JPG",
  "/images/photos/IMG_6119.JPG",
  "/images/photos/IMG_6121.jpg",
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
            <Image src={img} alt="client logo" className="mx-auto h-auto w-9/12" width={0} height={0} />
          </div>
        ))}
      </div>
    </div>
  )
}