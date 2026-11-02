
"use client";

import { useEffect, useRef, useState } from "react";

import InfoText from "@/components/ui/InfoText";
import PostPreview from "@/components/ui/post/PostPreview";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Post as PostType } from "@/types/post";
import { User as UserType } from "@/types/user";
import { Community as CommunityType } from "@/types/community";
import CommunityPreview from "@/components/ui/community/CommunityPreview";
import UserPreview from "@/components/ui/user/UserPreview";
import SearchTabs from "@/components/ui/search/SearchTabs";


const tabs = ["posts", "communities", "users"] as const;

type Tab = (typeof tabs)[number];

type SearchItem = PostType | CommunityType | UserType;

type ApiResponse<T> = {
  data: T[];
  nextCursor: string | null;
};

type Props = {
  query: string;
};

export default function SearchPageContent({ query }: Props) {
  const [activeTab, setActiveTab] = useState<"posts" | "communities" | "users">("posts");
  const [loading, setLoading] = useState(false);

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
    queryKey: ["search", activeTab, query],
    initialPageParam: null as string | null,

    queryFn: async ({ pageParam, signal }) => {
      const params = new URLSearchParams();
      if (pageParam) {
        params.set("cursorId", pageParam);
      }
      params.set("query", query);

      const response = await fetch(
        `/api/search/${activeTab}/?${params.toString()}`,
        { signal },
      );

      if (!response.ok) {
        throw new Error(
          `Nie udało się pobrać danych (${response.status}).`,
        );
      }

      const result = await response.json();

      switch (activeTab) {
        case "posts":
          return result as ApiResponse<PostType>;

        case "communities":
          return result as ApiResponse<CommunityType>;

        case "users":
          return result as ApiResponse<UserType>;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const searchData: SearchItem[] =
    data?.pages.reduce<SearchItem[]>(
      (acc, page) => [...acc, ...page.data],
      [],
    ) ?? [];

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


  const renderItem = (item: PostType | CommunityType | UserType) => {
    switch (activeTab) {
      case "posts":
        return <PostPreview data={item as PostType} />;

      case "communities":
        return <CommunityPreview data={item as CommunityType} />;

      case "users":
        return <UserPreview data={item as UserType} />;
    }
  };

  return (
    <div className="flex w-full items-center flex-col">
      <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-12 w-full max-w-200">
        {loading ? (
          <InfoText text="Ładowanie wyników..." />
        ) :
          <ul>
            {
              searchData.map((item, index) => (
                <li
                  key={index}
                  className="w-full max-w-200 mb-10 relative"
                  ref={
                    index === searchData.length - 5
                      ? sentinelRef
                      : null
                  }
                >
                  {renderItem(item)}
                </li>
              )
              )
            }
          </ul>
        }
      </div>
    </div>
  );
}

