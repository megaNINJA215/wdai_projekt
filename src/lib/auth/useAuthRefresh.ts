"use client";

import { PERSONALIZED_POSTS_QUERY_KEY } from "@/utils/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useAuthRefresh = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    localStorage.setItem("auth-change", crypto.randomUUID());

    void queryClient.resetQueries({
      queryKey: PERSONALIZED_POSTS_QUERY_KEY,
    });

    router.refresh();
  };
};