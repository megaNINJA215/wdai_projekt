"use client";

import { useEffect, useRef, useState } from "react";

const tabs = ["posts", "communities", "users"] as const;

type Props = {
  activeTab?: "posts" | "communities" | "users";
  setActiveTab?: (tab: "posts" | "communities" | "users") => void;
};

export default function SearchTabs({ activeTab = "posts", setActiveTab }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeButton = containerRef.current?.querySelector(
      `[data-tab="${activeTab}"]`
    ) as HTMLButtonElement | null;

    if (activeButton) {
      setIndicator({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeTab]);

  function translateTab(tab: (typeof tabs)[number]): string {
    switch (tab) {
      case "posts":
        return "Posty";
      case "communities":
        return "Społeczności";
      case "users":
        return "Użytkownicy";
    }
  }

  return (
    <div className="fixed w-full z-9 h-6 -translate-y-4 max-w-220">
      <div className="w-full bg-bg pt-20 -translate-y-20" >
        <div
          ref={containerRef}
          className="relative flex gap-8 justify-between w-2/5 m-auto min-w-fit"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              data-tab={tab}
              onClick={() => setActiveTab && setActiveTab(tab)}
              className={`relative pb-3 text-md font-bold capitalize transition-colors duration-200 ${activeTab === tab
                ? "text-primary-hover"
                : "text-primary-muted hover:text-primary"
                }`}
            >
              {translateTab(tab)}
            </button>
          ))}

          <span
            className="absolute bottom-2 h-1 rounded-full bg-border transition-all duration-300 ease-in-out"
            style={{
              width: `${indicator.width + 20}px`,
              transform: `translateX(${indicator.left - 10}px)`,
            }}
          />
        </div>
      </div>
      <div className="h-8 w-full bg-linear-to-b from-bg via-bg to-transparent -translate-y-22" />
    </div>
  );
}