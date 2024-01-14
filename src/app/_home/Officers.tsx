import Image from "next/image";
import Container from "./Container";

export default function Officers() {
  return (
    <div className="text-gray-600 dark:text-gray-300" id="officers">
      <Container>
        <div className="mb-20 space-y-4 px-6 md:px-0">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Officers
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
              <Image
                className="h-auto w-32 rounded-full"
                src="/images/avatars/president.webp"
                alt="user avatar"
                width={500}
                height={500}
              />
            </div>
            <h1 className="mt-4 text-lg font-medium text-gray-700 dark:text-white">
              Krishnan Vellore
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              President
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
              <Image
                className="h-auto w-32 rounded-full"
                src="/images/avatars/vp.webp"
                alt="user avatar"
                width={500}
                height={500}
              />
            </div>
            <h1 className="mt-4 text-lg font-medium text-gray-700 dark:text-white">
              Garrett Stevenson
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Vice President
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
              <Image
                className="h-auto w-32 rounded-full"
                src="/images/avatars/ctc.webp"
                alt="user avatar"
                width={500}
                height={500}
              />
            </div>
            <h1 className="mt-4 text-lg font-medium text-gray-700 dark:text-white">
              Aiden Kampwerth
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Competition Team Coordinator
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
              <Image
                className="h-auto w-32 rounded-full"
                src="/images/avatars/pr.webp"
                alt="user avatar"
                width={500}
                height={500}
              />
            </div>
            <h1 className="mt-4 text-lg font-medium text-gray-700 dark:text-white">
              Jae-son Rivera
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Public Outreach Officer
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-center justify-center gap-4">
              <Image
                className="h-auto w-32 rounded-full"
                src="/images/avatars/treasurer.webp"
                alt="user avatar"
                width={500}
                height={500}
              />
            </div>
            <h1 className="mt-4 text-lg font-medium text-gray-700 dark:text-white">
              Landon Uelsmann
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Treasurer
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
