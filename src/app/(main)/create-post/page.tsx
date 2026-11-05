"use client";

import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Submit from "@/components/ui/Submit";
import { cn } from "@/utils/cn";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import SelectedCommunity from "@/components/ui/community/SelectCommunity";
import { useSearchParams } from "next/navigation";
import { validatePostTitle, validatePostContent } from "@/utils/validators";
import { useRouter } from 'next/navigation';
import TextFormattingInfo from "@/components/ui/post/TextFormattingInfo";

export default function CreatePostPage() {
  const searchParams = useSearchParams();
  const initialCommunity = searchParams.get("c");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(initialCommunity);
  const [error, setError] = useState<any | null>(null);

  const {
    mutate: createPost,
    isPending: isCreating,
  } = useMutation({
    mutationFn: async () => {
      const endpoint = selectedCommunity
        ? `/api/communities/${encodeURIComponent(selectedCommunity)}/posts`
        : "/api/posts";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(new Error(result.error?.message || "Nie udało się utworzyć posta."));
      }

      return result;
    },

    onSuccess: (res) => {
      setTitle("");
      setContent("");
      setSelectedCommunity(null);
      router.refresh();
      router.push("/post/" + res.data.short_id);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validatePostTitle(title) === "invalid" || validatePostContent(content) === "invalid") {
      setError(new Error("Nieprawidłowe dane"));
      return;
    }

    createPost();
  };


  return (
    <div className="w-full max-w-180 mx-auto -mt-2 sm:mt-8 md:mt-40 lg:mt-48 p-8 bg-bg-hover h-fit rounded-2xl border-border border">
      <form
        className="flex flex-col gap-4 relative"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Tytuł posta"
          type="text"
          name="title"
          value={title}
          onChange={setTitle}
          validate={validatePostTitle}
          required
        />

        <div className="relative mt-8">
          <TextArea
            placeholder="Treść posta"
            name="content"
            value={content}
            onChange={setContent}
            textSize="small"
            minRows={5}
            maxRows={20}
            validate={validatePostContent}
            required
          />
          <div className="absolute -top-8 right-2">
            <TextFormattingInfo />
          </div>
        </div>

        <div className="flex flex-col md:justify-between gap-8 md:flex-row">
          <SelectedCommunity initialCommunity={initialCommunity} onSelect={setSelectedCommunity} selectedCommunity={selectedCommunity} />
          <Submit
            text="Opublikuj post"
            disabled={isCreating}
            style="max-w-48 self-center mt-4 shrink-0"
          />
        </div>
        <div className={cn("absolute -bottom-20 w-full left-0 text-center text-lg font-semibold transition-colors duration-150", error ? "text-danger" : "text-transparent")}>{error?.message}</div>
      </form>
    </div>
  );
}
