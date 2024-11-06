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
import { Poppins, DM_Sans } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export default function Header() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`${poppins.variable} ${dmSans.variable} font-sans`}>
      <nav
        className={`navbar ${showNavbar ? "translate-y-[60px]" : "-translate-y-full"}`}
      >
        <Container>
          <div className="navbar-content">
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
                    width={100}
                    height={100}
                    className="navbar-logo"
                  />
                </Link>
              </div>

              <div className="relative flex max-h-10 items-center lg:hidden">
                <label
                  htmlFor="toggle_nav"
                  className="relative -mr-6 p-6 lg:hidden"
                >
                  <div
                    aria-hidden="true"
                    className="m-auto h-0.5 w-5 rounded bg-sky-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                  <div
                    aria-hidden="true"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                </label>
              </div>
            </div>
            <div className="navbar-menu">
              <div className="w-full text-gray-600 dark:text-gray-300 lg:w-auto lg:pr-4 lg:pt-0">
                <ul className="flex flex-col gap-6 font-medium tracking-wide lg:flex-row lg:gap-0 lg:text-sm">
                  <li>
                    <a href="/#about" className="navbar-link">
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
                    <a href="/#articles" className="navbar-link">
                      <span>Articles</span>
                    </a>
                  </li>

                  <li>
                    <a href="/#faq" className="navbar-link">
                      <span>FAQ</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-12 lg:mt-0">
                <a href="apply" className="navbar-button">
                  <span className="navbar-button-text">Join Us</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
