import Image from "next/image";
import Container from "../../components/Container";

export default function Travel() {
  return (
    <div id="travel">
      <Container>
        <svg
          width="90pt"
          height="90pt"
          version="1.1"
          viewBox="0 0 1200 1200"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffffff"
        >
          <g>
            <path d="m1199.1 461.83c-8.5938-31.273-88.465-33.961-120.6-23.258-116.87 38.867-233.75 77.746-350.64 116.63l-405.72-162.02-42.816 45.637 173.62 208.51c-111.91 38.688-316.88 110.12-354.09 122.48-32.027 10.668 206.96 44.578 261.76 35.473 0 0 420.98-137.32 607.12-199.25 47.844-15.91 95.711-31.824 143.55-47.746 32.016-10.648 97.141-62.523 87.816-96.461z" />
            <path d="m32.52 621.5-32.52 30.047 86.242 100.61 124.98-44.016z" />
          </g>
        </svg>

        <div className="flex-row-reverse justify-between space-y-6 text-gray-600 lg:flex lg:items-center lg:gap-12 lg:space-y-0">
          <div className="lg:w-1/2">
            <Image
              src="/images/photos/IMG_6121.webp"
              alt="image"
              className="w-full"
              width={500}
              height={500}
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Travel Opportunities!
            </h2>
            <p className="my-8 text-gray-600 dark:text-gray-300">
              At TAMU ThinkTank, students can showcase their design projects at
              industry events with the help of various programs and services.
              Attending these events offers a chance to meet industry
              professionals, receive valuable feedback, and gain insight into
              current industry trends. Additionally, networking at project
              showcases can create meaningful connections and open up
              opportunities for future career growth.
            </p>
            <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="text-lg font-semibold text-gray-700 dark:text-indigo-300">
                    Texas Space Grant Consortium Showcase
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Johnson Space Center, Houston, TX
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-4 md:items-center">
                <div className="w-5/6">
                  <h1 className="text-lg font-semibold text-gray-700 dark:text-teal-300">
                    Engineering Project Showcase
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Zachry Engineering Education Complex, College Station, TX
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
