"use client";

import PostPreview from "@/components/ui/post/PostPreview";
import LoadingError from "@/components/ui/LoadingError";
import LoadingInfo from "@/components/ui/InfoText";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Post as PostType } from "@/types/post";

export default function Home() {

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
    queryKey: ["personalized-posts"],
    initialPageParam: null as string | null,

    queryFn: async ({ pageParam, signal }) => {
      const params = new URLSearchParams();
      if (pageParam) {
        params.set("cursorId", pageParam);
      }

      const response = await fetch(
        `/api/posts/?${params.toString()}`,
        { signal },
      );

      if (!response.ok) {
        throw new Error(
          `Nie udało się pobrać postów (${response.status}).`,
        );
      }

      return response.json() as Promise<{
        posts: PostType[];
        nextCursor: string | null;
      }>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const personalizedPosts = data?.pages.flatMap((page) => page.posts) ?? [];

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
    <div className="flex w-full items-center flex-col">
      <ul className="flex flex-col items-center w-full">
        {personalizedPosts.map((post, index) => (
          <li
            key={post.short_id}
            className="w-full max-w-200 mb-10 relative"
            ref={
              index === personalizedPosts.length - 5
                ? sentinelRef
                : null
            }
          >
            <PostPreview post={post} clampLines={10} />
          </li>
        ))}
      </ul>

      {isPending && <LoadingInfo text="Ładowanie postów..." />}

      {!isPending && !isError && personalizedPosts.length === 0 && (
        <LoadingInfo text="Brak postów do wyświetlenia." />
      )}

      {isFetchingNextPage && <LoadingInfo text="Pobieranie kolejnych postów..." />}

      {isError && (
        <LoadingError
          error={error}
          isFetchNextPageError={false}
          fetchNextPage={fetchNextPage}
          refetch={refetch}
        />
      )}

      {!isPending && !isError && !hasNextPage && personalizedPosts.length > 0 && (
        <LoadingInfo text="Wyświetlono wszystkie posty." />
      )}
    </div >
  )
}