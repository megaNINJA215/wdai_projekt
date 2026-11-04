"use client";

import { PERSONALIZED_QUERY_KEYS } from "@/utils/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useAuthRefresh = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    localStorage.setItem("auth-change", crypto.randomUUID());

    PERSONALIZED_QUERY_KEYS.map((queryKey) =>
      queryClient.resetQueries({ queryKey })
    )

    router.refresh();
  };
};