import ProjectCarousel from "@/app/_home/ProjectCarousel";
import Container from "./Container";

export default function Overview() {
  return (
    <div id="overview">
      <Container>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="mb-1 h-6 w-6 text-secondary"
        >
          <path
            fillRule="evenodd"
            d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
            clipRule="evenodd"
          />
        </svg>

        <div className="flex-row-reverse justify-between space-y-6 text-gray-600 lg:flex lg:items-center lg:gap-12 lg:space-y-0">
          <div className="lg:w-6/12">
            <ProjectCarousel />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Hands-On Project Experience
            </h2>
            <p className="my-8 text-gray-600 dark:text-gray-300">
              Design challenges provide an excellent starting point for aspiring
              engineers.
            </p>
            <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="dark text-lg font-semibold text-gray-700 dark:text-teal-300">
                    IV Fluid Generation (IVGEN) Mini pH Correction
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Team Hermes
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="dark text-lg font-semibold text-gray-700 dark:text-indigo-300">
                    TSGC Crew Tracking for Space Analog Research
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Team Vestigo
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="dark text-lg font-semibold text-gray-700 dark:text-teal-300">
                    AIAA Human Enabled Venus Robotic Exploration
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Team Astraeus
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="dark text-lg font-semibold text-gray-700 dark:text-indigo-300">
                    RASC-AL Large Scale Lunar Crater Prospector
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Team Selenis
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="dark text-lg font-semibold text-gray-700 dark:text-teal-300">
                    RASC-AL AI-Powered Self Replicating Probes
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Team Progredior
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="dark text-lg font-semibold text-gray-700 dark:text-indigo-300">
                    Blue Skies Advancing Aviation for Natural Disasters
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Team Elementum
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
