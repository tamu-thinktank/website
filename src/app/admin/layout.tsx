"use client";

import GradientLayout from "@/components/GradientLayout";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/trpc/shared";
import { Loader2 } from "lucide-react";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { AdminHeader } from "./admin-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GradientLayout>
        <Content>{children}</Content>
      </GradientLayout>
    </SessionProvider>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { data: session, status: authStatus } = useSession();

  return session ? (
    <>
      <section className="h-[90vh] w-11/12 space-y-4 md:w-3/4 lg:w-2/3">
        <AdminHeader />
        {children}
      </section>
    </>
  ) : (
    <Button
      disabled={authStatus === "loading"}
      onClick={() =>
        void signIn(
          "auth0",
          {
            redirect: true,
            callbackUrl: getBaseUrl() + "/admin",
          },
          {
            connection: "google-oauth2",
            prompt: "login",
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
