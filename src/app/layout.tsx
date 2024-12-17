import "@/styles/globals.css";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";
import { TRPCReactProvider } from "@/lib/trpc/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "./providers";


const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.WEB_URL),
  title: "TAMU ThinkTank",
  description: "The official website for TAMU ThinkTank.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "TypeScript",
    "TRPC",
    "PostgreSQL",
    "Prisma",
    "Vercel",
    "Radix UI",
    "TAMU ThinkTank",
    "TAMU",
    "ThinkTank",
    "Engineering",
    "Design",
    "Challenge",
    "Team",
    "Texas A&M University",
    "Texas A&M",
    "University",
    "College Station",
    "College",
    "Student",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.WEB_URL,
    title: "TAMU ThinkTank",
    description: "The official website for TAMU ThinkTank.",
    images: [`${env.WEB_URL}/og.jpg`],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Retrieve cookies asynchronously
  const cookieValue = cookies().toString();

  return (
    <html lang="en">
      <body className={`${font.className} bg-gray-900`}>
        <Providers>
          <TRPCReactProvider cookies={cookieValue}>
            {children}
            <Toaster />
            <Sonner />
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}