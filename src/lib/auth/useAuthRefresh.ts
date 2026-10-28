"use client";

import { useRouter } from "next/navigation";

export const useAuthRefresh = () => {
  const router = useRouter();
  return () => {
    localStorage.setItem("auth-change", crypto.randomUUID());
    router.refresh();
  };
};