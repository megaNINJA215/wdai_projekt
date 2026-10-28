"use client";

import { useEffect, useState } from "react";
import dogs from "./dogs.generated";

export default function Dogs() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % dogs.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed right-1/10 translate-x-1/2 top-1/5 z-40 h-3/5 w-64 lg:w-[calc(20%-2rem)] lg:max-w-64 hidden lg:flex flex-col gap-4 justify-between">
      <div className="w-full bg-fg-muted rounded-4xl border border-border p-4  text-md text-balance" >
        Nie wiedziałem co tu dać aby nie było pusto, więc dałem zdjęcia swojego pieska ponieważ{" "}<span className="font-bold text-primary">why fucking not?</span>
      </div>

      <div className="flex aspect-9/20 items-center justify-center overflow-hidden rounded-4xl border border-border bg-fg-muted">
        <div className="relative h-full w-full">
          {dogs.map((dog, i) => (
            <img
              key={i}
              src={dog}
              alt={`Zdjęcie pieska ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${index === i ? "z-10 opacity-100" : "z-0 opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
