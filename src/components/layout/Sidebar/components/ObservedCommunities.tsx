"use client";

import { useEffect, useRef } from 'react';
import Accordion from './Accordion';
import CommunityButton from './CommunityButton';
import { useInfiniteQuery } from '@tanstack/react-query';
import LoadingInfo from '@/components/ui/LoadingInfo';
import LoadingError from '@/components/ui/LoadingError';

export default function ObservedCommunities() {

  const sentinelRef = useRef<HTMLLIElement>(null);
  const loadingNextRef = useRef(false);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
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
  return (
    <div className="min-h-10">
      {
        !isPending && !isError && communities.length === 0 ? <div>asd</div> :
          <Accordion title="Obserwowane">
            <ul className="flex flex-col gap-2 pb-2 overflow-y-auto">
              {communities.map((community, index) => (
                <li
                  key={community}
                  className="w-full"
                  ref={
                    index === communities.length - 5
                      ? sentinelRef
                      : null
                  }
                >
                  <CommunityButton name={community} />
                </li>
              ))}
            </ul>


            {(isFetchingNextPage || isPending) && <LoadingInfo text="..." />}
          </Accordion>
      }
    </div>
  );
};