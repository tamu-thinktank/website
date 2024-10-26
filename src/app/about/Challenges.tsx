//FOR TESTING PURPOSES ONLY

import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";

export default function Challenges() {
  return (
    <Container>
      <div className="mb-12 justify-between space-y-2 pt-24 text-center">
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
            <Link href="https://blueskies.nianet.org/competition/" passHref>
              <Image
                src="https://blueskies.nianet.org/wp-content/uploads/BlueSkies_Logo_lg-1.png"
                alt="art cover"
                width="1000"
                height="1"
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
            </Link>
          </div>
          <div className="relative mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              NASA'S Gateways to Blue Skies Competition
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              Blue Skies expands engagement between universities and NASA's
              University Innovation Project, industry, and government partners
              by providing an opportunity for multi-disciplinary teams of
              students from all academic levels (i.e., freshman, sophomore,
              junior, senior, and graduate) to tackle significant challenges and
              opportunities for the aviation industry through a new project
              theme each year. The competition is guided by a push toward new
              technologies as well as environmentally and socially conscious
              aviation.
            </p>
          </div>
        </div>
        <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
          <div className="relative overflow-hidden rounded-xl">
            <Link href="https://www.herox.com/SolarDistrictCup" passHref>
              <Image
                src="https://d253pvgap36xx8.cloudfront.net/editor_uploads/252917/2023/06/28/SDC-logo-color-horizontal.jpg"
                alt="art cover"
                width="1000"
                height="1"
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
            </Link>
          </div>
          <div className="relative mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Solar District Cup
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              The Solar District Cup is a collegiate competition that challenges
              multidisciplinary student teams to design and model distributed
              energy systems for a mixed-use campus or district—groups of
              buildings served by a common electrical distribution feeder. The
              competition engages students across disciplines—engineering,
              finance, urban planning, sustainability, communications, and
              more—to reimagine how energy is generated, managed, and used in a
              district.
            </p>
          </div>
        </div>
        <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
          <div className="relative overflow-hidden rounded-xl">
            <Link href="https://rascal.nianet.org/" passHref>
              <Image
                src="https://www.nasa.gov/wp-content/uploads/2023/03/2023-rasc-al-banner-images.png?w=1500"
                alt="art cover"
                width="1000"
                height="1"
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
            </Link>
          </div>
          <div className="relative mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              RASC-AL
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              RASC-AL competitions fuel innovation for aerospace systems
              concepts, analogs, and technology prototyping by bridging gaps
              through university engagement. RASC-AL is open to undergraduate
              and graduate university-level students studying fields with
              applications to human space exploration (i.e., aerospace,
              bio-medical, electrical, and mechanical engineering; and life,
              physical, and computer sciences). RASC-AL projects allow students
              to incorporate their coursework into real aerospace design
              concepts and work together in a team environment.
              Interdisciplinary teams are encouraged.
            </p>
          </div>
        </div>
        <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
          <div className="relative overflow-hidden rounded-xl">
            <Link
              href="https://www.aiaa.org/get-involved/students-educators/Design-Competitions"
              passHref
            >
              <Image
                src="https://www.aiaa.org/images/default-source/site-design/logos/logo.png?sfvrsn=59ffaa92_4"
                alt="art cover"
                width="1000"
                height="1"
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
            </Link>
          </div>
          <div className="relative mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              AIAA Design Competitions
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              AIAA design competitions allow students to perform theoretical
              work and gain real-world insight into the design process. Whether
              students are designing an aircraft, engine, or space vehicle, they
              will go through all the primary design steps involved in
              determining a solution to a Request for Proposal (RFP). This
              includes determining a hypothetical solution, testing the
              hypothesis, evaluating its effectiveness, possibly doing some cost
              analysis, and finally preparing a report that will be submitted in
              response to the RFP. These responses are reviewed by experts in
              the field who will provide constructive responses to the students.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
