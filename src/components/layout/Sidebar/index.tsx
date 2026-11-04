"use server";

import { getCurrentUser } from "@/lib/auth/currentUser";
import SidebarClient from "./components/SidebarClient";
import DiscoverCommunities from "./components/DiscoverCommunities";
import Link from "next/link";
import ObservedCommunities from "./components/ObservedCommunities";

export default async function Sidebar() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <SidebarClient>
        <DiscoverCommunities size="full" />
      </SidebarClient>
    );
  }

  return (
    <SidebarClient>
      <div className="flex min-h-0 flex-1 flex-col">

        <Link href="/saved" className="bg-fg w-4/5 mx-auto text-center p-2 rounded-md hover:bg-fg-hover shrink-0">Zapisane posty</Link>
        <div className="h-4 shrink-0" />
        <Link href="/create-post" className="bg-fg w-4/5 mx-auto text-center p-2 rounded-md hover:bg-fg-hover shrink-0">Utwórz nowy post</Link>
        <div className="h-4 shrink-0" />
        <Link href="/create-community" className="bg-fg w-4/5 mx-auto text-center p-2 rounded-md hover:bg-fg-hover shrink-0">Utwórz nową społeczność</Link>

        <div className="h-1 bg-border w-4/5 mx-auto my-4 shrink-0 rounded-full" />

        <ObservedCommunities />

        <div className="
          relative before:absolute before:bottom-full before:left-0
          before:h-4 before:w-full
          before:bg-linear-to-t before:from-fg-muted before:to-transparent
          h-1 w-4/5 mx-auto mb-4 shrink-0 rounded-full bg-border
        " />

        <DiscoverCommunities size="compact" />
      </div>
    </SidebarClient>
  );
}