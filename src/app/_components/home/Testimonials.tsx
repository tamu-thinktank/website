import Image from "next/image";
import Container from "./Container";

export default function Testimonials() {
  return (
    <div className="text-gray-600 dark:text-gray-300" id="testimonials">
      <Container>
        <div className="mb-20 space-y-4 px-6 md:px-0">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Officers
          </h2>
        </div>
        <div className="gap-8 space-y-8 md:columns-2 lg:columns-3">
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
              <Image
                className="h-auto w-32 rounded-full"
                src="/images/avatars/avatar.webp"
                alt="user avatar"
                width="400"
                height="400"
                loading="lazy"
              />

            </div>
            <h6 className="text-lg font-medium text-gray-700 dark:text-white mt-4">
              Krishnan Vellore
            </h6>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              President
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
                <Image
                  className="h-auto w-32 rounded-full"
                  src="/images/avatars/avatar-1.webp"
                  alt="user avatar"
                  width="400"
                  height="400"
                  loading="lazy"
                />
              </div>
              <h6 className="text-lg font-medium text-gray-700 dark:text-white mt-4">
                Garrett Stevenson
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Vice President
              </p>
            </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
                <Image
                  className="h-auto w-32 rounded-full"
                  src="/images/avatars/avatar-2.webp"
                  alt="user avatar"
                  width="400"
                  height="400"
                  loading="lazy"
                />
              </div>
              <h6 className="text-lg font-medium text-gray-700 dark:text-white mt-4">
                Aiden Kampwerth
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Competition Team Coordinator
              </p>
            </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
                <Image
                  className="h-auto w-32 rounded-full"
                  src="/images/avatars/avatar-3.webp"
                  alt="user avatar"
                  width="400"
                  height="400"
                  loading="lazy"
                />
              </div>
              <h6 className="text-lg font-medium text-gray-700 dark:text-white mt-4">
                Jae-son Rivera
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Public Outreach Officer
              </p>
            </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
                <Image
                  className="h-auto w-32 rounded-full"
                  src="/images/avatars/avatar-4.webp"
                  alt="user avatar"
                  width="400"
                  height="400"
                  loading="lazy"
                />
              </div>
              <h6 className="text-lg font-medium text-gray-700 dark:text-white mt-4">
                Landon Uelsmann
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Treasurer 
              </p>
            </div>
          <div className="">
            <div className="flex gap-4">
            </div>
            <p className="mt-8">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Architecto laboriosam deleniti aperiam ab veniam sint non cumque
              quis tempore cupiditate. Sint libero voluptas veniam at
              reprehenderit, veritatis harum et rerum.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
