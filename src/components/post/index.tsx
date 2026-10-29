"use client";

import Link from 'next/link';
import { useState } from 'react';
import { getRelativeTime } from '@/utils/formatRelativeTime';
import { cn } from '@/utils/cn';
import FormattedText from '../ui/FormattedText';
import ProfilePicture from '../ui/ProfilePicture';

export interface PostProps {
  post: {
    short_id: string;
    title: string;
    content: string;
    community: string;
    author: string;
    created_at: string;
    edited_at?: string;
  };
  clampLines?: number;
}

export default function Post(props: PostProps) {
  const { post, clampLines } = props;
  const [isClamped, setIsClamped] = useState(false);

  return (
    <div className={cn("border-3 border-border rounded-4xl bg-fg ", isClamped ? "pb-8" : "")}>
      <Link href={`/post/${post.short_id}`} className="absolute inset-0 z-2 rounded-4xl" aria-label={`Przejdź do posta ${post.title}`} />
      <>

        <div className="flex flex-row  items-end justify-between w-[calc(100%-2rem)] m-4">

          <div className="flex flex-row gap-2">
            <Link href={`c/${post.community}`} className="z-5">
              <ProfilePicture type="community" name={post.community} size={48} />
            </Link>
            <div className="flex flex-col whitespace-nowrap">
              <Link href={`/c/${post.community}`} className="font-bold text-primary text-lg z-5">
                c/{post.community}
              </Link>
              <Link href={`/u/${post.author}`} className="text-sm text-text-secondary z-5">
                u/{post.author}
              </Link>
            </div>
          </div>

          <div className="flex-col text-end text-text-secondary flex line-clamp-1">
            <span className="">
              {getRelativeTime(post.created_at)}
            </span>
            <span className={cn("text-xs", post.edited_at ? "visible" : "invisible")}>
              Edited: {post.edited_at ? getRelativeTime(post.edited_at) : ""}
            </span>
          </div>

        </div>

        <div className="h-1 w-[calc(100%-4rem)] bg-fg-hover mx-8 rounded-full" />

        <div className="px-4 my-2 pb-1">
          <h1 className="text-2xl font-bold mb-2 wrap-anywhere">{post.title}</h1>
          <FormattedText text={post.content} style="text-md text-text-muted" clampLines={clampLines} setIsClamped={setIsClamped} />
        </div>
      </>
      {isClamped && (<>
        <div className="absolute h-21 rounded-b-4xl w-[calc(100%-6px)] bg-linear-to-t from-fg-muted from-0% via-fg-muted via-33% to-transparent to-100% bottom-0.75 flex justify-center items-center text-primary">
          <span className="translate-y-4">Zobacz cały post...</span>
        </div>
      </>
      )}
    </div>
  );
};