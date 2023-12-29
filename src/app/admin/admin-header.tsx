import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { signOut } from "next-auth/react";
import Link from "next/link";

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
      </div>
    </Menubar>
  );
}
