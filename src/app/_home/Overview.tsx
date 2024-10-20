import ProjectCarousel from "@/app/_home/ProjectCarousel";
import Container from "../../components/Container";

export default function Component() {
  return (
    <div id="overview" className="bg-[#0C0D0E] py-8 md:py-12">
      <Container>
        <div className="flex flex-col-reverse items-start justify-between space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="w-full space-y-6 lg:w-1/2 lg:pt-0">
            <h2 className="text-2xl font-bold italic text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Our <span style={{ color: "#B8B8B8" }}>Mission</span>
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 sm:text-base md:text-lg">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
            <div className="pt-6">
              <button className="w-full transform rounded-full border-2 border-white bg-transparent px-6 py-3 text-base text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black sm:text-lg">
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <ProjectCarousel />
          </div>
        </div>
      </Container>
    </div>
  );
}
