"use client";

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Post } from '@/types/post';
import PostHeader from './PostHeader';
import PostContent from './PostContent';

export interface PostPreviewProps {
  data: Post;
  clampLines?: number;
}

export default function PostPreview({ data, clampLines = 10 }: PostPreviewProps) {
  const [isClamped, setIsClamped] = useState(false);

  return (
    <div className={cn("border-3 border-border rounded-4xl bg-fg ", isClamped ? "pb-8" : "")}>
      <Link href={`/post/${data.short_id}`} className="absolute inset-0 z-2 rounded-4xl" aria-label={`Przejdź do posta ${data.title}`} />
      <>
        <PostHeader
          authorUsername={data.author}
          created_at={data.created_at}
          communityName={data.community}
          edited_at={data.edited_at}
        />

        <div className="h-1 w-[calc(100%-4rem)] bg-fg-hover mx-8 rounded-full" />

        <PostContent title={data.title} content={data.content} clampLines={clampLines} setIsClamped={setIsClamped} />
      </>
      {isClamped && (
        <div className="absolute h-21 rounded-b-4xl w-[calc(100%-6px)] bg-linear-to-t from-fg-muted from-0% via-fg-muted via-33% to-transparent to-100% bottom-0.75 flex justify-center items-center text-primary">
          <span className="translate-y-4">Zobacz cały data...</span>
        </div>
      )}
    </div>
  );
};