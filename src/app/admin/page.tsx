"use client";

import ApplicantsTable from "./applicants-table";
import { SessionProvider, useSession } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <AuthenticatedPage />
    </SessionProvider>
  );
}

function AuthenticatedPage() {
  const { status: authStatus } = useSession();

  return <>{authStatus === "authenticated" && <ApplicantsTable />}</>;
}