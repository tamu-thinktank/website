"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const clientLogos = [
  "/images/clients/ntl.png",
  "/images/clients/tsgc.png",
  "/images/clients/herox.png",
  "/images/clients/rascal.png",
  "/images/clients/aiaa.png",
  "/images/clients/aero.png",
]
const delay = 3000;

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [])

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === clientLogos.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => resetTimeout();
  }, [index]);

  return (
    <div className="w-screen flex justify-center items-center">
      <div className="h-80 w-2/3 whitespace-nowrap transition-all ease-in-out duration-1000" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
        {clientLogos.map((img, index) => (
          <div key={index} className={`inline-block w-full`}>
            <Image src={img} alt="client logo" className="h-80 w-full" width={0} height={0} />
          </div>
        ))}
      </div>
    </div>
  )
}