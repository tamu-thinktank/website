"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useMemo } from "react";

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
];

function shuffleArray(array: (string | undefined)[]) {
  const shuffled: typeof array = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.filter(Boolean);
}

export default function ProjectCarousel() {
  const images = useMemo(() => shuffleArray(orgImages), []);

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="p-1">
                <Image
                  src={img}
                  alt="client logo"
                  className="w-auto rounded-sm"
                  width={0}
                  height={0}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
