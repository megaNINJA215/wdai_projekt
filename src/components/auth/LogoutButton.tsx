"use client";

import { useAuthRefresh } from "@/lib/auth/useAuthRefresh";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

export interface LogoutButtonProps {
}

export default function LogoutButton(props: LogoutButtonProps) {
  const queryClient = useQueryClient();
  const authRefresh = useAuthRefresh();
  const router = useRouter();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      return fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      });
    },
    onSuccess: async () => {
      authRefresh();
      router.refresh();
      queryClient.clear();
    },
  });

  return (
    <button onClick={() => { logout(); }} className="bg-primary text-text px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:cursor-pointer hover:bg-danger transition-colors duration-500 h-8 sm:h-10">
      Wyloguj się
    </button>
  );
};