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