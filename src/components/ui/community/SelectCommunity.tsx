"use client";

import { cn } from "@/utils/cn";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ProfilePicture from "../ProfilePicture";

export interface SelectCommunityProps {
  initialCommunity: string | null;
  onSelect: (community: string | null) => void;
  selectedCommunity: string | null;
}

export default function SelectedCommunity(props: SelectCommunityProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const loadingNextRef = useRef(false);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["personalized-communities"],
    initialPageParam: null as string | null,

    queryFn: async ({ pageParam, signal }) => {
      const params = new URLSearchParams();
      if (pageParam) {
        params.set("cursorId", pageParam);
      }

      const response = await fetch(
        `/api/communities/?${params.toString()}`,
        { signal },
      );

      if (!response.ok) {
        throw new Error(
          `Nie udało się pobrać społeczności (${response.status}).`,
        );
      }

      return response.json() as Promise<{
        communities: string[];
        nextCursor: string | null;
      }>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: Infinity,
  });

  const communities = data?.pages.flatMap((page) => page.communities) ?? [];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetching || isError) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || loadingNextRef.current) {
          return;
        }

        loadingNextRef.current = true;
        void fetchNextPage()
          .finally(() => {
            loadingNextRef.current = false;
          });
      },
      {
        root: null,
        rootMargin: "120px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.parentElement?.contains(
          event.target as Node
        )
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const selectCommunity = (community: string | null) => {
    props.onSelect(community);
    setIsSelectOpen(false);
  };


  return (
    <div className="flex flex-col gap-2 mt-4 md:w-full w-sm max-w-full self-center flex-1">
      <div className="text-sm font-semibold text-text">
        Wybierz społeczność
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsSelectOpen((prev) => !prev)}
          className={cn(
            "w-full h-11 px-4 rounded-lg flex items-center justify-between gap-3 bg-bg-secondary text-fg-primary border-2 transition-colors",
            isSelectOpen ? "border-primary" : "border-primary-muted hover:border-primary"
          )}>
          <span
            className={cn("truncate", !props.selectedCommunity && "text-text")}>
            {props.selectedCommunity
              ? <div className="flex items-center"><ProfilePicture type="community" name={props.selectedCommunity} size={24} /><span className="text-primary ml-2">c/</span>{props.selectedCommunity}</div>
              : "Bez społeczności"}
          </span>
          {/* https://www.svgrepo.com/svg/509899/down-chevron */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" className={cn(
            "size-4 shrink-0 transition-transform",
            isSelectOpen && "rotate-180"
          )}>
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"></path>
            </g>
          </svg>
        </button>

        {isSelectOpen && (
          <div className="absolute z-50 top-full left-0 mt-2 w-full rounded-lg border border-primary-muted bg-bg-secondary shadow-lg overflow-hidden bg-fg">
            <div className="max-h-64 overflow-y-auto p-1">
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    type="button"
                    onClick={() => selectCommunity(null)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-left",
                      "flex items-center justify-between",
                      "transition-colors hover:bg-fg-muted",
                      !props.selectedCommunity
                        ? "bg-fg text-fg-primary"
                        : "text-text"
                    )}
                  >
                    <span>Bez społeczności</span>

                    {!props.selectedCommunity && (
                      <span className="text-primary">✓</span>
                    )}
                  </button>
                </li>

                {communities.map((community, index) => (
                  <li
                    key={community}
                    ref={index === communities.length - 1 ? sentinelRef : null}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        selectCommunity(community)
                      }
                      className={cn(
                        "w-full px-3 py-2 rounded-lg text-left",
                        "flex items-center justify-between gap-2",
                        "transition-colors hover:bg-fg-muted",
                        props.selectedCommunity === community
                          ? "bg-fg text-fg-primary"
                          : "text-text"
                      )}
                    >
                      <span className="truncate flex items-center">
                        <ProfilePicture type="community" name={community} size={24} />
                        <span className="text-primary ml-2">c/</span>{community}
                      </span>

                      {props.selectedCommunity === community && (
                        <span className="text-primary shrink-0">
                          ✓
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              {isPending && (
                <p className="text-sm text-text text-center py-3">
                  Ładowanie społeczności...
                </p>
              )}

              {isError && (
                <p className="text-sm text-danger text-center py-3">
                  Nie udało się pobrać społeczności.
                </p>
              )}

              {isFetchingNextPage && (
                <p className="text-sm text-text text-center py-3">
                  Ładowanie kolejnych...
                </p>
              )}

              {!isPending &&
                communities.length === 0 &&
                !isError && (
                  <p className="text-sm text-text text-center py-3">
                    Nie należysz do żadnej społeczności.
                  </p>
                )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-primary-hover">
        Możesz opublikować post publicznie lub w społeczności,
        do której należysz.
      </p>
    </div>
  );
};