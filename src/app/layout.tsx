import "@/styles/globals.css";

import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ToggleTheme } from "./_components/toggle-theme";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TAMU ThinkTank",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-white dark:bg-gray-900`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>
            {children}
            <div className="fixed bottom-5 right-5">
              <Toaster />
              <ToggleTheme />
            </div>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
