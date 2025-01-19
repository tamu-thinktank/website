"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "./Container";

import { Menu } from "lucide-react";
import { Poppins, DM_Sans } from "next/font/google";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const router = useRouter();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    void router.push(href);
  };

  return (
    <header className={`${poppins.variable} ${dmSans.variable} font-sans`}>
      <nav className="navbar fixed left-0 right-0 top-0 z-50 bg-white shadow-md">
        <Container>
          <div className="navbar-content">
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
                <Sheet>
                  <SheetTrigger className="p-2">
                    <Menu className="h-6 w-6 text-gray-300" />
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full border-gray-800 bg-[#0C0D0E]"
                  >
                    <div className="flex h-full flex-col gap-8 pt-16">
                      <a
                        href="/applicants"
                        onClick={(e) => handleLinkClick(e, "/applicants")}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        Applicants
                      </a>
                      <a
                        href="/interviewees"
                        onClick={(e) => handleLinkClick(e, "/interviewees")}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        Interviewees
                      </a>
                      <a
                        href="/members"
                        onClick={(e) => handleLinkClick(e, "/members")}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        Members
                      </a>
                      <a
                        href="/scheduler"
                        onClick={(e) => handleLinkClick(e, "/scheduler")}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        Scheduler
                      </a>
                      <a
                        href="/statistics"
                        onClick={(e) => handleLinkClick(e, "/statistics")}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        Statistics
                      </a>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="navbar-menu">
              <div className="w-full text-gray-600 dark:text-gray-300 lg:w-auto lg:pr-4 lg:pt-0">
                <ul className="flex flex-col gap-6 font-medium tracking-wide lg:flex-row lg:gap-0 lg:text-sm">
                  <li>
                    <a
                      href="/applicants"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/applicants")}
                    >
                      <span>Applicants</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/interviewees"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/interviewees")}
                    >
                      <span>Interviewees</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/members"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/members")}
                    >
                      <span>Members</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/scheduler"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/scheduler")}
                    >
                      <span>Scheduler</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/statistics"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/statistics")}
                    >
                      <span>Statistics</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
