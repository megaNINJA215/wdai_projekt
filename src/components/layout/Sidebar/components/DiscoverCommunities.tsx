"use client";

import { useEffect, useRef, useState } from "react";
import CommunityButton from "./CommunityButton";
import { cn } from "@/utils/cn";
import Accordion from "./Accordion";
import { useQuery } from "@tanstack/react-query";

export interface DiscoverCommunitiesProps {
  size: "full" | "compact";
}

export default function DiscoverCommunities(props: DiscoverCommunitiesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;

      const itemHeight = 40;
      const gap = 8;

      const newCount = Math.floor(
        (height + gap) / (itemHeight + gap)
      );

      setCount(newCount);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const { data } = useQuery({
    queryKey: ["communities", "discover"],
    queryFn: async () => {
      const response = await fetch(`/api/communities/discover${props.size === "full" && count > 0 ? `?limit=${count}` : ""}`, { cache: "no-store" });
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
        <div className="flex flex-col gap-2 my-2 flex-1 overflow-y-hidden" ref={containerRef}>
          {communities.map((community) => (
            <CommunityButton key={community} name={community} />
          ))}
        </div>
      </>}

      {props.size === "compact" && <>
        <Accordion title="Odkryj nowe społeczności!">
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