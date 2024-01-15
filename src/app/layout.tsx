import "@/styles/globals.css";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { type Metadata } from "next";
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
  keywords: ["thinktank"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TAMU ThinkTank",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-gray-900`}>
        <Providers>
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
            <Toaster />
            <Sonner />
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
