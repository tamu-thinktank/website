"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;

    const animate = () => {
      if (carousel.scrollLeft >= scrollWidth - clientWidth) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += 1;
      }
    };

    const animation = setInterval(animate, 50);

    return () => clearInterval(animation);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth;
    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full overflow-hidden py-12">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
        Latest Articles
      </h2>
      <div
        ref={carouselRef}
        className="flex w-full gap-6 overflow-x-hidden"
        aria-label="Article carousel"
      >
        {articles.concat(articles).map((article, index) => (
          <Link
            key={`${article.id}-${index}`}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-64 md:w-80"
            aria-label={`View article: ${article.title}`}
          >
            <Image
              src={article.image}
              alt={article.title}
              width={320}
              height={180}
              className="h-40 w-full object-cover transition-all duration-300 group-hover:h-48 sm:h-36 md:h-44"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white transition-all duration-300 group-hover:h-full group-hover:bg-black/70">
              <h3 className="text-lg font-semibold group-hover:mb-2">
                {article.shortTitle}
              </h3>
              <p className="mt-2 hidden text-sm group-hover:block">
                {article.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <button
        onClick={() => handleScroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800 dark:text-white" />
      </button>
      <button
        onClick={() => handleScroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 text-gray-800 dark:text-white" />
      </button>
    </div>
  );
}
