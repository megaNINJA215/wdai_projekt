"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { CommentType } from "@/types/comments";
import LoadingInfo from "../../LoadingInfo";
import LoadingError from "../../LoadingError";
import Link from "next/link";
import ProfilePicture from "../../ProfilePicture";
import { getRelativeTime } from "@/utils/formatRelativeTime";

type CommentProps = {
    comment: CommentType;
    shortPostId: string;
    isLoggedIn: boolean;
    setParentComment: (parentComment: { parentId: string; parentUsername: string } | null) => void;
    depth?: number;
    parentHeight?: number;
};

export default function Comment({
    comment,
    shortPostId,
    isLoggedIn,
    setParentComment,
    depth = 0,
    parentHeight = 0,
}: CommentProps) {
    const [areRepliesOpen, setAreRepliesOpen] = useState(false);
    const sentinelRef = useRef<HTMLElement>(null);
    const loadingNextRef = useRef(false);
    const setSentinelRef = (node: HTMLElement | null) => { sentinelRef.current = node; };
    const articleRef = useRef<HTMLElement>(null);
    const [commentHeight, setCommentHeight] = useState(0);
    const [replyHeights, setReplyHeights] = useState<number[]>([]);
    const replyRefs = useRef<Map<number, HTMLLIElement>>(new Map());

    useEffect(() => {
        const element = articleRef.current;
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            setCommentHeight(entry.contentRect.height);
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

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
        queryKey: ["comment-replies", shortPostId, comment.id],
        enabled: areRepliesOpen && comment.replies_count > 0,
        initialPageParam: null as string | null,
        queryFn: async ({ pageParam, signal }) => {
            const params = new URLSearchParams();
            params.set("parentCommentId", comment.id);
            if (pageParam) params.set("cursorId", pageParam);

            const response = await fetch(
                `/api/posts/${encodeURIComponent(shortPostId)}/comments?${params.toString()}`,
                { signal },
            );

            if (!response.ok) {
                throw new Error(
                    `Nie udało się pobrać odpowiedzi (${response.status}).`,
                );
            }

            return response.json() as Promise<{
                comments: CommentType[];
                nextCursor: string | null;
            }>;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

    const replies = data?.pages.flatMap((page) => page.comments) ?? [];

    useEffect(() => {
        const sentinel = sentinelRef.current;

        if (
            !areRepliesOpen ||
            !sentinel ||
            !hasNextPage ||
            isFetching ||
            isError
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting || loadingNextRef.current) return;

                loadingNextRef.current = true;
                void fetchNextPage().finally(() => {
                    loadingNextRef.current = false;
                });
            },
            {
                root: null,
                rootMargin: "180px 0px",
                threshold: 0,
            },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [
        areRepliesOpen,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isError,
    ]);

    function toggleReplies() {
        setAreRepliesOpen((current) => !current);
    }

    useEffect(() => {
        const observers: ResizeObserver[] = [];

        replies.forEach((reply, index) => {
            const element = replyRefs.current.get(index);
            if (!element) return;

            const observer = new ResizeObserver(([entry]) => {
                const height = entry.contentRect.height;

                setReplyHeights((prev) => {
                    if (prev[index] === height) return prev;

                    const updated = [...prev];
                    updated[index] = height;
                    return updated;
                });
            });

            observer.observe(element);
            observers.push(observer);
        });

        return () => observers.forEach((observer) => observer.disconnect());
    }, [replies]);


    const nestingClass =
        depth === 0
            ? "min-w-0"
            : `relative min-w-0 pl-4 ${depth <= 4 ? "ml-4" : "ml-0 sm:ml-1"
            }`;

    return (
        <div className={nestingClass}>
            {depth > 0 && (
                <div className={depth <= 4 ? "" : "translate-x-0 sm:translate-x-1"}>
                    <div
                        className="absolute -left-0.5 top-2 py-4 w-0.5 bg-border -translate-y-full z-0"
                        style={{ height: parentHeight + 12 }}
                    />
                    <div className="absolute -left-0.5 top-5.5 h-4 w-6 -translate-y-full rounded-bl-full border-b-2 border-l-2 border-border z-0" />
                </div>
            )}

            <article
                ref={articleRef}
                className="relative min-w-0 z-10"
            >
                <div className="flex flex-wrap items-center justify-between gap-x-3 sm:gap-y-2">
                    <div className="flex min-w-0 flex-wrap items-center sm:gap-2">
                        <span className="break-all text-sm font-semibold">
                            <Link
                                key={comment.author.username}
                                href={`/u/${comment.author.username}`}
                                className="cursor-pointer  rounded-2xl flex flex-row z-10"
                            >
                                <ProfilePicture name={comment.author.username} size={32} type="user" />
                                <p className="truncate px-2 pb- flex items-center text-md">
                                    <span className="text-text-muted">u/</span>
                                    <span>{comment.author.username}</span>
                                </p>
                            </Link>
                        </span>
                    </div>

                    <div className="max-w-full px-2.5 py-1 text-xs font-medium flex flex-col ml-8">
                        <span>
                            {comment.parent_comment_id
                                && <>
                                    Odpowiedź do {comment.parent_author_username ? (
                                        <span className="truncate">
                                            <span className="text-primary">u/</span>
                                            <span>{comment.parent_author_username}</span>
                                        </span>
                                    ) : "komentarza"}
                                </>}
                        </span>
                        <span className="text-text-muted sm:self-end">
                            {getRelativeTime(comment.created_at)}
                        </span>
                    </div>
                </div>

                <div className="ml-8">

                    <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-6">
                        {comment.content}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                        {isLoggedIn && setParentComment && (
                            <button
                                type="button"
                                onClick={() => setParentComment({ parentId: comment.id, parentUsername: comment.author.username })}
                                className="text-xs font-semibold text-primary transition hover:underline"
                            >
                                Odpowiedz
                            </button>
                        )}

                        {comment.replies_count > 0 && (
                            <button
                                type="button"
                                onClick={toggleReplies}
                                aria-expanded={areRepliesOpen}
                                aria-controls={`comment-replies-${comment.id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:opacity-75"
                            >
                                {areRepliesOpen
                                    ? "Ukryj odpowiedzi"
                                    : `Pokaż odpowiedzi (${comment.replies_count})`}
                                <span
                                    aria-hidden="true"
                                    className={`inline-block text-base leading-none duration-300 transition-transform w-5 h-5 ${areRepliesOpen ? "-rotate-180" : "rotate-0"
                                        }`}
                                >
                                    <svg viewBox="0 -1 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" className="transition-colors duration-250">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"></path>
                                        </g>
                                    </svg>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </article>

            {areRepliesOpen && replies.length !== 0 && (
                <div
                    id={`comment-replies-${comment.id}`}
                    className="space-y-3"
                >
                    <ul className="flex flex-col items-center w-full">
                        {replies.map((reply, index) => (
                            <li
                                key={reply.id}
                                ref={(node) => {
                                    if (node) {
                                        replyRefs.current.set(index, node);
                                    } else {
                                        replyRefs.current.delete(index);
                                    }
                                }}
                                className="w-full max-w-200 mt-3 relative last:[&>div>div:last-child]:bg-bg"
                            >
                                <Comment
                                    comment={reply}
                                    shortPostId={shortPostId}
                                    isLoggedIn={isLoggedIn}
                                    depth={depth + 1}
                                    setParentComment={setParentComment}
                                    parentHeight={
                                        index === 0
                                            ? commentHeight
                                            : replyHeights[index - 1] ?? 0
                                    }
                                />
                            </li>
                        ))}
                    </ul>

                    {isPending && <LoadingInfo text="Ładowanie odpowiedzi..." />}

                    {isFetchingNextPage && <LoadingInfo text="Pobieranie kolejnych komentarzy..." />}

                    {isError && (
                        <LoadingError
                            error={error}
                            isFetchNextPageError={false}
                            fetchNextPage={fetchNextPage}
                            refetch={refetch}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
