import Container from "@/components/Container";
import Image from "next/image";

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
              Challenge 1
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              Challenge Description 1
            </p>
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
              Challenge 2
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              Challenge Description 2
            </p>
          </div>
        </div>
        <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="https://i.kym-cdn.com/entries/icons/original/000/039/393/cover2.jpg"
              alt="art cover"
              width="1000"
              height="667"
              className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Challenge 3
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              Challenge Description 3
            </p>
          </div>
        </div>
        <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="https://media.tenor.com/60rUBc0DtFoAAAAe/far-too-easy-cringe-martincitopants-martincitopants.png"
              alt="art cover"
              width="1000"
              height="667"
              className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Challenge 4
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              Challenge Description 4
            </p>
          </div>
        </div>
        <div className="group rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="https://preview.redd.it/aerodynamics-of-a-cow-v0-42nixaopuhxa1.jpg?width=640&crop=smart&auto=webp&s=75cfd3307be2838d315dfbd8ed754b762a33c2fd"
              alt="art cover"
              width="1000"
              height="667"
              className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Challenge 5
            </h3>
            <p className="mb-8 mt-6 text-gray-600 dark:text-gray-300">
              Challenge Description 5
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
