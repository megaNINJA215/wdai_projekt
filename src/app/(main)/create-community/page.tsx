"use client";

import Input from "@/components/ui/Input";
import ProfilePicture from "@/components/ui/ProfilePicture";
import Submit from "@/components/ui/Submit";
import { useState } from "react";
import { validateCommunityDescription, validateCommunityName } from "@/utils/validators";
import TextArea from "@/components/ui/TextArea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { cn } from "@/utils/cn";
import { MEMBERSHIP_QUERY_KEYS } from "@/utils/queryKeys";

export default function createCommunityPage() {
  const router = useRouter();

  const [error, setError] = useState<any | null>(null);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const queryClient = useQueryClient();

  const { mutate: loginFn, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());

      const res = await fetch("/api/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || "Community creation failed");
      }

      return result;
    },
    onSuccess: async () => {
      MEMBERSHIP_QUERY_KEYS.map((queryKey) =>
        queryClient.resetQueries({ queryKey })
      )
      router.refresh();
      router.push("/");
    },
    onError: (error) => {
      setError(error);
    }
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateCommunityDescription(communityDescription) === "invalid" || validateCommunityName(communityName) === "invalid") {
      setError(new Error("Nieprawidłowe dane"));
      return;
    }
    const formData = new FormData(e.currentTarget);
    loginFn(formData);
  };

  return (
    <div className="w-full max-w-180 mx-auto mt-24 sm:mt-32 md:mt-40 lg:mt-48 bg-bg-hover h-fit p-8 border-border border rounded-2xl">
      <form className="flex flex-col gap-4 relative" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 self-center">
          <div className="size-16 sm:size-24 md:size-32 shrink-0">
            <ProfilePicture type="community" name={communityName} size={128} />
          </div>
          <Input placeholder="Nazwa społeczności" type="text" name="communityName" value={communityName} onChange={setCommunityName} style="my-auto text-sm md:text-2xl max-w-64 md:max-w-80" validate={validateCommunityName} />
        </div>
        <TextArea placeholder="Opis społeczności" name="communityDescription" value={communityDescription} onChange={setCommunityDescription} validate={validateCommunityDescription} textSize="small" style="mt-8" minRows={1} />
        <Submit text="Utwórz społeczność" disabled={isPending} style="max-w-48 self-end" />
        <div className={cn("absolute md:-bottom-20 -bottom-32 w-full left-0 text-center text-lg font-semibold transition-colors duration-150", error ? "text-danger" : "text-transparent")}>{error?.message}</div>
      </form>
    </div>
  );
}