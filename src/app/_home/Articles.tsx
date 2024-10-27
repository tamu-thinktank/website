"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "Team Selenis wins best Non-Capstone Team Award",
    shortTitle: "Team Selenis Wins",
    image: "/images/photos/selenis_win.webp",
    link: "https://engineering.tamu.edu/news/2024/05/engineering-project-showcase-highlights-senior-capstone-design-projects.html",
  },
  {
    id: 2,
    title: "Texas A&M team wins Texas Space Grant Consortium Design Challenge",
    shortTitle: "Team Vestigo Wins",
    image:
      "https://engineering.tamu.edu/news/2023/07/_news-images/AERO-news-Vestigo-06July2023.jpg",
    link: "https://engineering.tamu.edu/news/2023/07/texas-am-team-wins-texas-space-grant-consortium-design-challenge.html",
  },
  {
    id: 3,
    title: "NASA's Waste Jettison Mechanism Challenge Winners",
    shortTitle: "Aggie Aeros Win",
    image:
      "https://d253pvgap36xx8.cloudfront.net/challenges/thumbnail/8d50149c82f611ec8d16862fe09b0a86/8c0628a682f611eca2ab8a8fe6f2b952.webp",
    link: "https://www.herox.com/events/154-meet-the-winners-nasas-waste-jettison-mechanism-ch",
  },
];

export default function ArticleCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const animateCarousel = () => {
      setTranslateX((prevTranslateX) => {
        const newTranslateX = prevTranslateX - 0.1 / 2;
        return newTranslateX <= -100 ? 0 : newTranslateX;
      });
    };

    const animationId = requestAnimationFrame(function animate() {
      animateCarousel();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  const repeatedArticles = [...articles, ...articles, ...articles, ...articles];

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden py-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl md:text-4xl">
        Latest Articles
      </h2>
      <div className="relative mx-auto max-w-5xl">
        <div
          ref={carouselRef}
          className="flex"
          style={{
            transform: `translateX(${translateX}%)`,
            width: `${repeatedArticles.length * 25}%`,
          }}
        >
          {repeatedArticles.map((article, index) => (
            <div
              key={`${article.id}-${index}`}
              className="w-full flex-shrink-0 px-2 sm:w-1/2 lg:w-1/3 lg:px-4"
            >
              <Link
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`View article: ${article.title}`}
              >
                <div className="relative h-0 pb-[40%] sm:pb-[52.5%]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-3 text-white">
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm font-semibold group-hover:mb-1 sm:text-base lg:text-lg">
                      {article.shortTitle}
                    </h3>
                    <p className="mt-1 hidden text-xs opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100 sm:text-sm">
                      {article.title}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[16.67%] bg-gradient-to-r from-[#0C0D0E] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[16.67%] bg-gradient-to-l from-[#0C0D0E] to-transparent" />
      </div>
    </div>
  );
}
