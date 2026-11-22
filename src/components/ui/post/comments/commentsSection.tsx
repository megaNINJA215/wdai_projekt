"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Comment from "./postComment";
import CreateComment from "./createComment";
import { CommentType } from "@/types/comments";
import LoadingInfo from "../../LoadingInfo";
import LoadingError from "../../LoadingError";

type CommentsSectionProps = {
    shortPostId: string;
    isLoggedIn: boolean;
};

export default function CommentsSection({ shortPostId, isLoggedIn }: CommentsSectionProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [parentComment, setParentComment] = useState<{ parentId: string; parentUsername: string } | null>(null);
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
        queryKey: ["post-comments", shortPostId],
        initialPageParam: null as string | null,

        queryFn: async ({ pageParam, signal }) => {
            const params = new URLSearchParams();
            if (pageParam) {
                params.set("cursorId", pageParam);
            }

            const response = await fetch(
                `/api/posts/${encodeURIComponent(shortPostId)}/comments?${params.toString()}`,
                { signal },
            );

            if (!response.ok) {
                throw new Error(
                    `Nie udało się pobrać komentarzy (${response.status}).`,
                );
            }

            return response.json() as Promise<{
                comments: CommentType[];
                nextCursor: string | null;
            }>;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

    const comments = data?.pages.flatMap((page) => page.comments) ?? [];

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
        if (!isCreateOpen) {
            setParentComment(null);
        }
    }, [isCreateOpen]);

    useEffect(() => {
        setIsCreateOpen(parentComment !== null);
    }, [parentComment]);

    return (
        <section className="w-full p-3 shadow-sm sm:p-5 mt-20">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold sm:text-xl">Dyskusja</h2>
                    <p className="mt-1 text-xs opacity-60 sm:text-sm">
                        Komentarze do posta i odpowiedzi społeczności
                    </p>
                </div>

                {isLoggedIn && (
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover sm:self-auto hover:cursor-pointer"
                    >
                        <span aria-hidden="true" className="text-lg leading-none">
                            +
                        </span>
                        Dodaj komentarz
                    </button>
                )}
            </div>

            <ul className="flex flex-col items-center w-full">
                {comments.map((comment, index) => (
                    <li
                        key={comment.id}
                        className="w-full max-w-200 mb-10 relative last:[&>div>div:last-child]:bg-bg"
                        ref={
                            index === comments.length - 5
                                ? sentinelRef
                                : null
                        }
                    >
                        <Comment
                            key={comment.id}
                            comment={comment}
                            shortPostId={shortPostId}
                            isLoggedIn={isLoggedIn}
                            setParentComment={setParentComment}
                        />
                    </li>
                ))}
            </ul>

            {isPending && <LoadingInfo text="Ładowanie komentarzy..." />}

            {isError && comments.length === 0 && (
                <div className="rounded-xl border border-border bg-bg-hover/40 p-4 text-sm">
                    <p className="text-red-600">
                        {error instanceof Error
                            ? error.message
                            : "Nie udało się pobrać komentarzy."}
                    </p>
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-3 text-sm font-semibold text-primary hover:underline"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            )}

            {!isPending && !isError && comments.length === 0 && (
                <LoadingInfo text="Nikt jeszcze nie skomentował tego posta." />
            )}


            {isFetchingNextPage && <LoadingInfo text="Pobieranie kolejnych komentarzy..." />}

            {isError && (
                <LoadingError
                    error={error}
                    isFetchNextPageError={false}
                    fetchNextPage={fetchNextPage}
                    refetch={refetch}
                />
            )}

            {!isPending && !isError && !hasNextPage && comments.length > 0 && (
                <LoadingInfo text="Wyświetlono wszystkie komentarze." />
            )}

            {isCreateOpen && (
                <CreateComment
                    shortPostId={shortPostId}
                    parentComment={parentComment}
                    onClose={() => setIsCreateOpen(false)}
                />
            )}
        </section>
    );
}
