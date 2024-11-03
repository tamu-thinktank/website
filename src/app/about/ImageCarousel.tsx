"use client";
import { useState, useEffect } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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

  // Function to go to the previous slide
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? orgImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Function to go to the next slide
  const nextSlide = () => {
    const isLastSlide = currentIndex === orgImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative mx-auto mt-8 h-[70vh] w-[90vw] max-w-7xl overflow-hidden rounded-3xl">
      <Carousel>
        <CarouselContent
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {orgImages.map((image, index) => (
            <CarouselItem
              key={index}
              className="h-[70vh] w-full flex-shrink-0 object-cover"
            >
              <img
                src={image}
                alt={`Slide ${index}`}
                className="h-[70vh] w-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform text-3xl text-[#0C0D0E]"
        >
          <BsFillArrowLeftCircleFill />
        </button>

        {/* Custom Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform text-3xl text-[#0C0D0E]"
        >
          <BsFillArrowRightCircleFill />
        </button>
      </Carousel>
    </div>
  );
}
