"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { useState } from "react";


export interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar(props: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed left-0 top-6 z-50 flex h-10 w-10 transform items-center justify-center rounded-lg border-2 border-border bg-fg p-3 text-white transition-transform duration-300 lg:hidden",
          isOpen
            ? "translate-x-6"
            : "translate-x-[calc(10vw-20px)] sm:translate-x-6"
        )}
        aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed left-0 top-0 z-40 h-[calc(100vh-1.5rem)] w-64 lg:w-[calc(20%-2rem)] lg:max-w-64 
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"}
          lg:translate-x-0 bg-fg-muted m-3 rounded-xl border border-border flex flex-col pb-4
        `}
      >
        <Link href="/" className="h-16 flex items-center justify-center text-xl font-semibold shrink-0">
          Medioc<span className="text-primary font-bold">Re</span>
        </Link>
        <div className="h-0.5 bg-border w-4/5 mx-auto mb-4 shrink-0" />
        <div className="w-full flex-1 flex overflow-hidden flex-col">
          {props.children}
        </div>
      </div>
    </>
  );
}