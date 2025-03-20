"use client";

import { SessionProvider } from "next-auth/react";
import Nav from "../../components/AdminTopFooter";
import { MemberProvider } from "./transfer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SessionProvider>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // tmporarily skip authentication
  return (
    <MemberProvider>
      <Nav />
      <section style={{ background: "#0C0D0E" }}>{children}</section>
    </MemberProvider>
  );
}
