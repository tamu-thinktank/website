"use client";
import React from 'react';
import { useEffect } from 'react';
import Card from "@/components/Card";
import { projects } from '@/data';
import Lenis from '@studio-freight/lenis';

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
    <div className="flex flex-col space-y-8 mb-8">
      {projects.map((project, index) => (
        <Card key={index} i={index} {...project} />
      ))}
    </div>
  );
}
