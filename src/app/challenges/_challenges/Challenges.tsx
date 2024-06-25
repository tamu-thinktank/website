import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

export default function Challenges() {
  return (
    <div id="articles">
      <Container>
        <div className="mb-12 space-y-2 text-center justify-between pt-24">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Fall 2024 Student Design Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-300 lg:mx-auto lg:w-6/12">
            The Official TAMU ThinkTank Fall 2024 Challenge Suite
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="https://d253pvgap36xx8.cloudfront.net/challenges/thumbnail/8d50149c82f611ec8d16862fe09b0a86/8c0628a682f611eca2ab8a8fe6f2b952.webp"
                alt="art cover"
                width="1000"
                height="667"
                className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative mt-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                NASA's Waste Jettison Mechanism Challenge Winners
              </h3>
              <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
                The team developed the Spring Loaded Ejection Mechanism (SLEM)
                to eject waste out of the Orion capsule during long-distance
                missions. The SLEM was TAMU ThinkTank's first project, and the
                team won 4th Place overall and a $1000 cash prize.
              </p>
              <Link
                className="inline-block"
                target="_blank"
                href="https://www.herox.com/events/154-meet-the-winners-nasas-waste-jettison-mechanism-ch"
              >
                <span className="text-info dark:text-blue-300">
                  Read more about Aggie Aeros
                </span>
              </Link>
            </div>
          </div>
          <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="https://engineering.tamu.edu/news/2023/07/_news-images/AERO-news-Vestigo-06July2023.jpg"
                alt="art cover"
                width="1000"
                height="667"
                className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative mt-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Texas A&M team wins Texas Space Grant Consortium Design
                Challenge
              </h3>
              <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
                Texas A&M University's and ThinkTank's very own Team Vestigo,
                composed of freshmen, took first place against 16 other
                university teams for their creation of a wearable device to
                track crew member location and orientation while in space.
              </p>
              <Link
                className="inline-block"
                target="_blank"
                href="https://engineering.tamu.edu/news/2023/07/texas-am-team-wins-texas-space-grant-consortium-design-challenge.html"
              >
                <span className="text-info dark:text-blue-300">
                  Read more about Team Vestigo
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
