"use client";
import React from "react";
import { useEffect } from "react";
import Card from "@/components/Card";
import { projects } from "@/app/about/data";
import Lenis from "lenis";

export default function CardStack() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <div className="mb-8 flex flex-col space-y-8">
      {projects.map((project: any, index: any) => (
        <Card key={index} i={index} {...project} />
      ))}
    </div>
  );
}
