"use client";
import React, { useEffect } from "react";
import Card from "@/components/Card";
import { projects } from "@/data";
import Lenis from "@studio-freight/lenis";

interface ScrollTarget {
  section: string;
  offset: number;
}

export default function CardStack() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Check for stored scroll target with type safety
    const scrollData = sessionStorage.getItem("scrollTarget");
    if (scrollData) {
      try {
        const parsedData = JSON.parse(scrollData) as ScrollTarget;

        // Validate the parsed data has the required properties
        if ("section" in parsedData && "offset" in parsedData) {
          // Calculate scroll position based on viewport height
          const viewportHeight = window.innerHeight;
          const scrollPosition = viewportHeight * parsedData.offset;

          // Add a slight delay to ensure the page is fully loaded
          setTimeout(() => {
            window.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });
            // Clear the stored data after scrolling
            sessionStorage.removeItem("scrollTarget");
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing scroll target data:", error);
      }
    }
  }, []);

  return (
    <div className="mb-8 flex flex-col space-y-8">
      {projects.map((project, index) => (
        <Card key={index} i={index} {...project} />
      ))}
    </div>
  );
}
