import Image from "next/image";
import Container from "./Container";

const clientLogos = [
  "/images/clients/ntl.png",
  "/images/clients/tsgc.png",
  "/images/clients/herox.png",
  "/images/clients/rascal.png",
  "/images/clients/aiaa.png",
  "/images/clients/aero.png",
]

export default function HeroSection() {
  return (
    <div className=" relative" id="home">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="h-56 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700"></div>
        <div className="h-32 bg-gradient-to-r from-cyan-400 to-sky-300 blur-[106px] dark:to-indigo-600"></div>
      </div>
      <Container>
        <div className="relative ml-auto pt-36 flex flex-col h-screen">
          <div className="mx-auto text-center lg:w-2/3">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white md:text-6xl xl:text-7xl">
              TAMU ThinkTank
            </h1>
            <p className="mt-8 text-gray-700 dark:text-gray-300">
              
            We provide a platform for students to compete in real engineering 
            crowdsourcing competitions and present to professionals in industry-leading 
            companies while teaching the leadership and self-discipline needed to run a completely independent team.

            </p>
            <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
              <a
                href="#features"
                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
              >
                <span className="relative text-base font-semibold text-white">
                  Learn more
                </span>
              </a>
              <a
                href="apply"
                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
              >
                <span className="relative text-base font-semibold text-primary dark:text-white">
                  Apply
                </span>
              </a>
            </div>
            <div className="mt-16 hidden justify-between border-y border-gray-100 py-8 dark:border-gray-800 sm:flex">
              <div className="text-center">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Industry Experience
                </h6>
                <p className="mt-2 text-gray-500">7 Project Teams</p>
              </div>
              <div className="text-center">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Cooperative Atmosphere
                </h6>
                <p className="mt-2 text-gray-500">150+ Members</p>
              </div>
              <div className="text-center">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                Personal Empowerment
                </h6>
                <p className="mt-2 text-gray-500">Internship Opportunities</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-10 items-center justify-center h-full">
            {
              clientLogos.map((logo, index) => (
                <Image
                  key={index}
                  src={logo}
                  className={`mx-auto ${index == 0 ? "h-24" : "h-auto"} w-auto`}
                  loading="lazy"
                  alt="client logo"
                  width={0}
                  height={0}
                />
              ))
            }
          </div>
        </div>
      </Container>
    </div>
  );
}
