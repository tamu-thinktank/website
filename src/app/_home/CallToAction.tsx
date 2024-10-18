import Image from "next/image";
import Container from "../../components/Container";

export default function CallToAction() {
  return (
    <div className="relative py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 m-auto grid h-max w-full grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="h-56 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700"></div>
        <div className="h-32 bg-gradient-to-r from-cyan-400 to-sky-300 blur-[106px] dark:to-indigo-600"></div>
      </div>
      <Container>
        <div className="relative">
          <Image
            className="mx-auto h-auto w-32 rounded-full"
            src="/ttt.svg"
            alt="user avatar"
            width={500}
            height={500}
          />

          <div className="m-auto mt-6 space-y-6 md:w-8/12 lg:w-7/12">
            <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
              Join Us Today!
            </h1>
            <p className="text-center text-xl text-gray-600 dark:text-gray-300">
              Join our design challenges to gain hands-on experience,
              specialized skills, and faculty mentorship.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="apply"
                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
              >
                <span className="relative text-base font-semibold text-primary dark:text-white">
                  Apply
                </span>
              </a>
              <a
                href="#overview"
                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:bg-primary-foreground sm:w-max"
              >
                <span className="relative text-base font-semibold text-white">
                  More about
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
