"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Container from "./Container";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLinkClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    viewportMultiplier?: number,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);

    const targetPath = href.split("#")[0] || "/";

    if (targetPath === pathname && viewportMultiplier !== undefined) {
      // Same page, just scroll
      window.scrollTo({
        top: window.innerHeight * viewportMultiplier,
        behavior: "smooth",
      });
    } else {
      // Different page, navigate then scroll
      await router.push(href);
      if (viewportMultiplier !== undefined) {
        // Increased timeout to ensure page load
        setTimeout(() => {
          window.scrollTo({
            top: window.innerHeight * viewportMultiplier,
            behavior: "smooth",
          });
        }, 300); // Increased from 100ms to 300ms
      }
    }
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
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative p-2"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 text-gray-300" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
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
                      <span>Challenges</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/", 2)}
                    >
                      <span>Articles</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/about"
                      className="navbar-link"
                      onClick={(e) => handleLinkClick(e, "/about", 6)}
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
                  <span className="navbar-button-text">Join Us</span>
                </a>
              </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md lg:hidden">
                <div className="flex h-full flex-col px-6 py-20">
                  <ul className="flex flex-col items-center gap-8 text-xl text-white">
                    <li>
                      <a
                        href="/about"
                        onClick={(e) => handleLinkClick(e, "/about")}
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="/challenges"
                        onClick={(e) => handleLinkClick(e, "/challenges")}
                      >
                        Challenges
                      </a>
                    </li>
                    <li>
                      <a href="/" onClick={(e) => handleLinkClick(e, "/", 2)}>
                        Articles
                      </a>
                    </li>
                    <li>
                      <a
                        href="/about"
                        onClick={(e) => handleLinkClick(e, "/about", 6)}
                      >
                        FAQ
                      </a>
                    </li>
                    <li className="mt-8">
                      <a
                        href="/apply"
                        className="navbar-button"
                        onClick={(e) => handleLinkClick(e, "/apply")}
                      >
                        <span className="navbar-button-text">Join Us</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </Container>
      </nav>
    </header>
  );
}
