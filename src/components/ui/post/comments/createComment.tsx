"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextArea from "../../TextArea";
import { validateCommentContent } from "@/utils/validators";
import { cn } from "@/utils/cn";

type CreateCommentProps = {
    shortPostId: string;
    parentComment: { parentId: string; parentUsername: string } | null;
    onClose: () => void;
};

export default function CreateComment({
    shortPostId,
    parentComment,
    onClose,
}: CreateCommentProps) {
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();
    const [error, setError] = useState<any | null>(null);

    const {
        mutate: createComment,
        isPending: isCreating,
    } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/posts/${encodeURIComponent(shortPostId)}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content,
                        parentCommentId: parentComment?.parentId ?? null,
                    }),
                },
            );
            const result = await response.json();

            if (!response.ok) {
                setError(new Error(result.error?.message || "Nie udało się utworzyć posta."));
            }

            return result;
        },

        onSuccess: async (res) => {
            setContent("");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["post-comments", shortPostId],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["comment-replies", shortPostId],
                }),
            ]);

            onClose();
        },
    });

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isCreating) {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isCreating, onClose]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateCommentContent(content) === "invalid") {
            setError(new Error("Nieprawidłowe dane"));
            return;
        }

        createComment();
    };

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isCreating) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-comment-title"
                className="w-full max-w-xl rounded-2xl border border-border bg-bg p-4 shadow-2xl sm:p-6"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2
                            id="create-comment-title"
                            className="text-lg font-bold sm:text-xl"
                        >
                            {parentComment?.parentId ? "Dodaj odpowiedź" : "Dodaj komentarz"}
                        </h2>
                        <p className="mt-1 text-sm opacity-70">
                            {parentComment?.parentId && parentComment?.parentUsername
                                ? `Odpowiadasz użytkownikowi u/${parentComment?.parentUsername}.`
                                : "Twój komentarz zostanie opublikowany pod postem."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isCreating}
                        aria-label="Zamknij okno"
                        className="-mr-1 -mt-1 h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl transition hover:bg-bg-hover"
                    >
                        {/* wzięte z https://www.svgrepo.com/svg/500512/close-bold*/}
                        <svg viewBox="-128 -128 1280 1280" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path fill="#ffffff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path>
                            </g>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <TextArea
                        placeholder="napisz coś..."
                        name="content"
                        value={content}
                        onChange={setContent}
                        textSize="small"
                        minRows={5}
                        maxRows={20}
                        validate={validateCommentContent}
                        required
                        style="mt-16"
                    />

                    <div className="mt-1 flex justify-between gap-3 text-xs opacity-55">
                        <span>Limit: 2 000 znaków</span>
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isCreating}
                            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim() || isCreating}
                            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCreating ? "Publikowanie..." : "Opublikuj"}
                        </button>
                    </div>
                </form>
                <div className={cn("absolute -bottom-20 w-full left-0 text-center text-lg font-semibold transition-colors duration-150", error ? "text-danger" : "text-transparent")}>{error?.message}</div>
            </section>
        </div>
    );
}
