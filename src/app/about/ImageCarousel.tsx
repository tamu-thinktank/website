"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useScroll, useTransform, motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

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

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);

  return (
    <div
      ref={containerRef}
      className="font-dm-sans relative -mt-16 h-[200vh] w-full md:-mt-32"
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ scale, y: yOffset }}
      >
        <Carousel
          className="h-full w-full"
          plugins={[
            Autoplay({
              delay: 3500,
              stopOnHover: false,
              stopOnInteraction: false,
            }),
          ]}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="flex">
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

          <CarouselPrevious
            aria-label="Previous slide"
            className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 left-4 z-10 -translate-y-1/2 transform rounded-full bg-black p-2 text-white transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </CarouselPrevious>

          <CarouselNext
            aria-label="Next slide"
            className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 right-4 z-10 -translate-y-1/2 transform rounded-full bg-black p-2 text-white transition-all duration-300"
          >
            <ChevronRight size={24} />
          </CarouselNext>
        </Carousel>
      </motion.div>
    </div>
  );
}
