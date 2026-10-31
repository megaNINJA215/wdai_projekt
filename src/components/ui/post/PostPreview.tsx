"use client";

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Post as PostType } from '@/types/post';
import PostHeader from './PostHeader';
import PostContent from './PostContent';

export interface PostPreviewProps {
  post: PostType;
  clampLines?: number;
}

export default function PostPreview(props: PostPreviewProps) {
  const { post, clampLines } = props;
  const [isClamped, setIsClamped] = useState(false);

  return (
    <div className={cn("border-3 border-border rounded-4xl bg-fg ", isClamped ? "pb-8" : "")}>
      <Link href={`/post/${post.short_id}`} className="absolute inset-0 z-2 rounded-4xl" aria-label={`Przejdź do posta ${post.title}`} />
      <>
        <PostHeader
          authorUsername={post.author}
          created_at={post.created_at}
          communityName={post.community}
          edited_at={post.edited_at}
        />

        <div className="h-1 w-[calc(100%-4rem)] bg-fg-hover mx-8 rounded-full" />

        <PostContent title={post.title} content={post.content} clampLines={clampLines} setIsClamped={setIsClamped} />
      </>
      {isClamped && (
        <div className="absolute h-21 rounded-b-4xl w-[calc(100%-6px)] bg-linear-to-t from-fg-muted from-0% via-fg-muted via-33% to-transparent to-100% bottom-0.75 flex justify-center items-center text-primary">
          <span className="translate-y-4">Zobacz cały post...</span>
        </div>
      )}
    </div>
  );
};