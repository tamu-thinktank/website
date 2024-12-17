"use client";

import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/trpc/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Papa from "papaparse";

export function AdminHeader() {
  return (
    <Menubar className="justify-between">
      <MenubarMenu>
        <MenubarTrigger>Pages</MenubarTrigger>
        <MenubarContent>
          <Link href={"/"}>
            <MenubarItem>Home</MenubarItem>
          </Link>
          <Link href={"/admin"}>
            <MenubarItem>Admin</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>
      <div className="flex">
        <MenubarMenu>
          <MenubarTrigger>
            <Link href={"/admin/times"}>Times</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={() => void signOut()}>
            Sign out
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <ExportCSV />
        </MenubarMenu>
      </div>
    </Menubar>
  );
}

function ExportCSV() {
  const { toast } = useToast();

  const { data } = api.admin.getAllApplications.useQuery();

  const handleDownload = () => {
    if (!data?.length) {
      toast({
        variant: "destructive",
        title: "No data to export",
        description: "No users found.",
      });
      return;
    }

    const csvString = Papa.unparse(data, {
      header: true,
      skipEmptyLines: true,
    });
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    // Create a link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      size={"sm"}
      variant={"secondary"}
      className={
        "whitespace-nowrap bg-violet-400 hover:bg-violet-500 dark:bg-violet-600 dark:hover:bg-violet-500"
      }
    >
      Download CSV
    </Button>
  );
}
