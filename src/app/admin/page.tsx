"use client";

import { getBaseUrl } from "@/trpc/shared";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {session ? (
        <>
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Button
            onClick={() => void signOut()}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            Sign out
          </Button>
        </>
      ) : (
        <Button
          onClick={() =>
            void signIn(
              "auth0",
              {
                redirect: true,
                callbackUrl: getBaseUrl(),
              },
              {
                connection: "google-oauth2",
                prompt: "login",
                response_type: "code",
              },
            )
          }
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign in
        </Button>
      )}
    </main>
  );
}
