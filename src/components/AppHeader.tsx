"use client";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [showNavbar, setShowNavbar] = useState(true);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      <nav
        className={`fixed top-0 z-10 w-full border-b border-gray-300/30 bg-[#0C0D0E] transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Container>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 md:py-3 lg:py-2">
            <input
              aria-hidden="true"
              type="checkbox"
              name="toggle_nav"
              id="toggle_nav"
              className="peer hidden"
            />
            <div className="relative z-20 flex w-full justify-between md:px-0 lg:w-max">
              <div className="flex items-center space-x-2">
                <Link href="/">
                  <Image
                    src="/ttt.svg"
                    alt="art cover"
                    loading="lazy"
                    width={100}
                    height={100}
                    className="w-50 h-auto object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

              <div className="relative flex max-h-10 items-center lg:hidden">
                <label
                  htmlFor="toggle_nav"
                  id="hamburger"
                  className="relative  -mr-6 p-6"
                >
                  <div
                    aria-hidden="true"
                    id="line"
                    className="m-auto h-0.5 w-5 rounded bg-sky-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                  <div
                    aria-hidden="true"
                    id="line2"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                </label>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="fixed inset-0 z-10 h-screen w-screen origin-bottom scale-y-0 bg-white/70 backdrop-blur-2xl transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 dark:bg-gray-900/70 lg:hidden"
            ></div>
            <div
              className="invisible absolute left-0 top-full z-20 w-full origin-top translate-y-1 scale-95 flex-col flex-wrap justify-end gap-6 rounded-3xl border border-gray-100  bg-white p-8 opacity-0 shadow-2xl shadow-gray-600/10 transition-all duration-300 
                            peer-checked:visible peer-checked:scale-100 peer-checked:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none lg:visible lg:relative lg:flex lg:w-7/12 lg:translate-y-0 lg:scale-100 lg:flex-row lg:items-center lg:gap-0
                            lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100 
                            lg:shadow-none lg:peer-checked:translate-y-0 lg:dark:bg-transparent"
            >
              <div className="w-full text-gray-600 dark:text-gray-300 lg:w-auto lg:pr-4 lg:pt-0">
                <ul className="flex flex-col gap-6 font-medium tracking-wide lg:flex-row lg:gap-0 lg:text-sm">
                  <li>
                    <a
                      href="/#about"
                      className="block transition hover:text-primary md:px-4"
                    >
                      <span>About</span>
                    </a>
                  </li>

                  <li>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center transition hover:text-primary md:px-4">
                        Challenges <ChevronDown className="ml-1 h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Option 1</DropdownMenuItem>
                        <DropdownMenuItem>Option 2</DropdownMenuItem>
                        <DropdownMenuItem>Option 3</DropdownMenuItem>
                        <DropdownMenuItem>Option 4</DropdownMenuItem>
                        <DropdownMenuItem>Option 5</DropdownMenuItem>
                        <DropdownMenuItem>Option 6</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>

                  <li>
                    <a
                      href="/#articles"
                      className="block transition hover:text-primary md:px-4"
                    >
                      <span>Articles</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/#faq"
                      className="block transition hover:text-primary md:px-4"
                    >
                      <span>FAQ</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-12 lg:mt-0">
                <a
                  href="apply"
                  className="relative flex h-[35px] w-[120px] items-center justify-center rounded-[48px] px-4 before:absolute before:inset-0 before:rounded-[48px] before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:bg-primary-foreground"
                >
                  <span className="relative text-sm font-semibold text-black">
                    Join Us
                  </span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
