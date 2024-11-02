"use client";
import { useState, useEffect } from 'react';
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs';

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
    "/images/imageCarouselPhotos/image12.webp"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? orgImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === orgImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-[90vw] max-w-7xl mx-auto h-[70vh] overflow-hidden mt-8 rounded-3xl">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {orgImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className="w-full h-[70vh] object-cover flex-shrink-0"
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl z-10"
      >
        <BsFillArrowLeftCircleFill />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl z-10"
      >
        <BsFillArrowRightCircleFill />
      </button>
    </div>
  );
}
