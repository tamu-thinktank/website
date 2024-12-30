"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Container from "./Container";
import { useEffect, useState } from "react";
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
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

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

  const handleLinkClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    viewportMultiplier?: number,
  ) => {
    e.preventDefault();

    const targetPath = href.split("#")[0] ?? "/"; // Use ?? for safer fallback

    if (targetPath === pathname && viewportMultiplier !== undefined) {
      scrollToPosition(viewportMultiplier);
    } else {
      // Ensure `await` is only used if router.push is async
      await router.push(href);
      if (viewportMultiplier !== undefined) {
        setTimeout(() => {
          scrollToPosition(viewportMultiplier);
        }, 500); // Increased from 300 to 500ms
      }
    }
  };

  const scrollToPosition = (viewportMultiplier: number) => {
    const isMobile = window.innerWidth < 768; // Assuming 768px as the mobile breakpoint
    const scrollMultiplier = isMobile
      ? viewportMultiplier * 1.5
      : (viewportMultiplier ?? 0); // Use ?? instead of ||
    window.scrollTo({
      top: window.innerHeight * scrollMultiplier,
      behavior: "smooth",
    });
  };

  return (
    <header className={`${poppins.variable} ${dmSans.variable} font-sans`}>
      <nav
        className={`navbar ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
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
                        href="/about"
                        onClick={(e) => handleLinkClick(e, "/about")}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        About
                      </a>
                      <a
                        href="/challenges"
                        onClick={(e) => handleLinkClick(e, "/challenges")}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        Design Challenges
                      </a>
                      <a
                        href="/"
                        onClick={(e) => handleLinkClick(e, "/", 2.55)}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        Articles
                      </a>
                      <a
                        href="/about"
                        onClick={(e) => handleLinkClick(e, "/about", 6.3)}
                        className="text-lg font-medium text-gray-200 transition-colors hover:text-white"
                      >
                        FAQ
                      </a>
                      <a
                        href="/apply"
                        onClick={(e) => handleLinkClick(e, "/apply")}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
                      >
                        Join Us
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
                      href="/about"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/about")}
                    >
                      <span>About</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/challenges"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/challenges")}
                    >
                      <span>Competitions</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/", 2.75)}
                    >
                      <span>Articles</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/about", 8)}
                    >
                      <span>FAQ</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-12 lg:mt-0">
                <a
                  href="/apply"
                  className="navbar-button"
                  onClick={(e) => handleLinkClick(e, "/apply")}
                >
                  <span className="navbar-button-text">Apply</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
