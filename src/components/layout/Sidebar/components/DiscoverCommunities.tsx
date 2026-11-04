"use client";

import CommunityButton from "./CommunityButton";
import { cn } from "@/utils/cn";
import Accordion from "./Accordion";
import { useQuery } from "@tanstack/react-query";

export interface DiscoverCommunitiesProps {
  size: "full" | "compact";
}

export default function DiscoverCommunities(props: DiscoverCommunitiesProps) {
  const { data } = useQuery({
    queryKey: ["discover-communities"],
    queryFn: async () => {
      const response = await fetch(`/api/communities/discover${props.size === "full" ? `?limit=30` : ""}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(
          `Nie udało się pobrać społeczności (${response.status}).`
        );
      }
      return response.json() as Promise<{
        communities: string[];
      }>;
    },
    staleTime: Infinity,
  });

  const communities = data?.communities ?? []

  if (communities.length === 0) {
    return null;
  }

  return (
    <div className={cn("text-text text-balance text-center font-semibold flex flex-col min-h-10 shrink-0", props.size === "full" ? "flex-1" : "")}>

      {props.size === "full" && <>

        Odkryj społeczności, które mogą cię zainteresować. Stwórz konto by do nich dołączyć!
        <div className="flex flex-col gap-2 my-2 flex-1 min-h-0 overflow-hidden">
          {communities.map((community) => (
            <div key={community} className="shrink-0">
              <CommunityButton name={community} />
            </div>
          ))}
        </div>
      </>}

      {props.size === "compact" && <>
        <Accordion title="Odkrywaj społeczności!">
          <div className="w-full mx-auto flex flex-col gap-2 pb-2 overflow-y-hidden">
            {communities.map((community) => (
              <CommunityButton key={community} name={community} />
            ))}
          </div>
        </Accordion>
      </>}

    </div >
  );
}