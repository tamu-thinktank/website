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
  {
    id: 4,
    title: "NASA Selects Texas A&M Team for the 2025 RASC-AL Competition",
    shortTitle: "Team Servus Wins",
    image: "/images/photos/rascalwin.png",
    link: "https://www.nasa.gov/general/nasa-selects-14-finalist-teams-for-the-2025-rasc-al-competition/",
  },
];
<style jsx global>{`
  .fade-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background:
      linear-gradient(
        to right,
        #0c0d0e 0%,
        rgba(12, 13, 14, 0.738) 19.27%,
        rgba(12, 13, 14, 0.541) 34.72%,
        rgba(12, 13, 14, 0.382) 47.68%,
        rgba(12, 13, 14, 0.278) 58.36%,
        rgba(12, 13, 14, 0.194) 67.94%,
        rgba(12, 13, 14, 0.126) 76.92%,
        rgba(12, 13, 14, 0.075) 85.12%,
        rgba(12, 13, 14, 0.042) 92.55%,
        rgba(12, 13, 14, 0.021) 96.72%,
        rgba(12, 13, 14, 0.008) 98.81%,
        rgba(12, 13, 14, 0.002) 99.85%,
        transparent 100%
      ),
      linear-gradient(
        to left,
        #0c0d0e 0%,
        rgba(12, 13, 14, 0.738) 19.27%,
        rgba(12, 13, 14, 0.541) 34.72%,
        rgba(12, 13, 14, 0.382) 47.68%,
        rgba(12, 13, 14, 0.278) 58.36%,
        rgba(12, 13, 14, 0.194) 67.94%,
        rgba(12, 13, 14, 0.126) 76.92%,
        rgba(12, 13, 14, 0.075) 85.12%,
        rgba(12, 13, 14, 0.042) 92.55%,
        rgba(12, 13, 14, 0.021) 96.72%,
        rgba(12, 13, 14, 0.008) 98.81%,
        rgba(12, 13, 14, 0.002) 99.85%,
        transparent 100%
      );
    background-repeat: no-repeat;
    background-size:
      20% 100%,
      20% 100%;
    background-position: left, right;
  }

  @media (max-width: 640px) {
    .fade-overlay {
      background-size:
        30% 100%,
        30% 100%;
    }
  }
`}</style>;
export default function ArticleCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const animateCarousel = () => {
      setTranslateX((prevTranslateX) => {
        const newTranslateX = prevTranslateX - 0.01;
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
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden py-4 sm:py-8">
      <div className="relative z-[1]">
        <h2 className="font-poppins mb-1 text-center text-lg font-bold italic text-gray-800 dark:text-white sm:mb-2 sm:text-2xl md:text-4xl">
          Latest Articles
        </h2>
        <p className="font-dm-sans mb-3 text-center text-xs text-[#B8B8B8] sm:mb-6 sm:text-base md:text-lg">
          Read about some of the things we've done so far
        </p>
      </div>
      <div className="relative mx-auto mt-8 max-w-5xl sm:mt-12">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-linear"
          style={{
            transform: `translateX(${translateX}%)`,
            width: `${repeatedArticles.length * 100}%`,
          }}
        >
          {repeatedArticles.map((article, index) => (
            <div
              key={`${article.id}-${index}`}
              className="w-full px-1 sm:w-1/2 sm:px-2 lg:w-1/3 lg:px-4"
            >
              <Link
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`View article: ${article.title}`}
              >
                <div className="relative h-0 pb-[75%] sm:pb-[56.25%]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-2 text-white sm:p-3">
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                    <h3 className="text-xs font-semibold group-hover:mb-0.5 sm:text-sm lg:text-lg">
                      {article.shortTitle}
                    </h3>
                    <p className="mt-0.5 hidden text-[10px] opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100 sm:mt-1 sm:text-xs">
                      {article.title}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="fade-overlay" />
      </div>

      <div className="absolute inset-0 -z-10 bg-blue-500/5" />
    </div>
  );
}
