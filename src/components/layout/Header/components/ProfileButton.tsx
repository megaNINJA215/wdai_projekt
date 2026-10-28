"use client";

import ProfilePicture from "@/components/ui/ProfilePicture";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProfileButton({
  username,
}: {
  username: string;
}) {
  const profileRef = useRef<HTMLAnchorElement>(null);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const profile = profileRef.current;
    const parent = profile?.parentElement;

    if (!profile || !parent) return;

    const update = () => {
      const parentWidth = parent.getBoundingClientRect().width;
      const availableWidth = parentWidth * 0.16;

      setShowName(availableWidth > 45 + username.length * 8);
    };

    const observer = new ResizeObserver(update);
    observer.observe(parent);
    update();

    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={profileRef}
      href={`/u/${username}`}
      className="absolute right-1/10 translate-x-1/2 flex h-10 w-fit items-center justify-center rounded-full bg-primary text-sm"
    >
      <ProfilePicture name={username} size={40} type="user" />
      {showName && (
        <span className="pl-2 pr-3 text-text-dark">
          <span className="text-text-dark-muted">u/</span>
          {username}
        </span>
      )}
    </Link>
  );
}
