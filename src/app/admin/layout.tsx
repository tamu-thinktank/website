"use client";

import GradientLayout from "@/components/GradientLayout";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/trpc/shared";
import { Loader2 } from "lucide-react";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { AdminHeader } from "./admin-header";
import Nav from "../../components/AdminTopFooter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <section>{children}</section>
    </SessionProvider>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { status: authStatus } = useSession();

  return authStatus === "authenticated" ? (
    <>
      <Nav />
      <section>{children}</section>
    </>
  ) : (
    <Button
      disabled={authStatus === "loading"}
      onClick={() =>
        void signIn(
          "auth0",
          {
            callbackUrl: getBaseUrl() + "/admin",
          },
          {
            connection: "google-oauth2",
            response_type: "code",
          },
        )
      }
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-primary no-underline transition hover:bg-white/20"
    >
      {authStatus === "loading" ? (
        <Loader2 className="animate-spin" />
      ) : (
        "Sign in"
      )}
    </Button>
  );
}
