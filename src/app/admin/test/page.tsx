"use client";

import { MembersPage } from "../members/memberPage";
import { IntervieweesPage } from "../interviewees/intervieweePage";
import { SessionProvider, useSession } from "next-auth/react";
import { MemberProvider } from "../transfer";

export default function Home() {
  return (
    <div>
      <IntervieweesPage />
    </div>
  );
}

// function AuthenticatedPage() {
//   const { status: authStatus } = useSession();

//   return <>{authStatus === "authenticated" && <ApplicantsTable />}</>;
// }
