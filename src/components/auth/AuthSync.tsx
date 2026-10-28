"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "auth-change") {
        router.refresh();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [router]);

  return null;
}