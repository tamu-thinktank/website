"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useScroll, useTransform, motion } from "framer-motion";

export default function ImageCarousel() {
  const orgImages = [
    "/images/imageCarouselPhotos/image1.webp",
    "/images/imageCarouselPhotos/image2.webp",
    "/images/imageCarouselPhotos/image3.webp",
    "/images/imageCarouselPhotos/image5.webp",
    "/images/imageCarouselPhotos/image6.webp",
    "/images/imageCarouselPhotos/image7.webp",
    "/images/imageCarouselPhotos/image9.webp",
    "/images/imageCarouselPhotos/image10.webp",
    "/images/imageCarouselPhotos/image11.webp",
    "/images/imageCarouselPhotos/image12.webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? orgImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === orgImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="font-dm-sans relative -mt-16 h-[200vh] w-full md:-mt-32"
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ scale, y: yOffset }}
      >
        <Carousel className="h-full w-full">
          <CarouselContent
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {orgImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="h-screen w-full flex-shrink-0 object-cover"
              >
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="h-full w-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2 text-3xl text-white transition-all duration-300 hover:bg-opacity-75"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2 text-3xl text-white transition-all duration-300 hover:bg-opacity-75"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </Carousel>
      </motion.div>
    </div>
  );
}
