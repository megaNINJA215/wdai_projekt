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
    <div className="group rounded-4xl hover:bg-bg-hover transition-colors duration-200 py-4">
      <Link href={`/post/${data.short_id}`} className="absolute inset-0 z-2 rounded-4xl" aria-label={`Przejdź do posta ${data.title}`} />
      <>
        <PostHeader
          authorUsername={data.author}
          created_at={data.created_at}
          communityName={data.community}
          edited_at={data.edited_at}
        />

        <PostContent title={data.title} content={data.content} clampLines={clampLines} setIsClamped={setIsClamped} />
      </>
      {isClamped && (
        <div className="absolute h-10 rounded-b-4xl w-full bg-linear-to-t from-bg-hover from-0% via-bg-hover via-33% to-transparent to-100% bottom-0 flex justify-center items-center text-text text-shadow-black text-shadow-lg font-semibold">
          <span>Zobacz cały post...</span>
        </div>
      )}
      <div className="absolute -bottom-5.25 w-full h-0.5 bg-border rounded-full" />
    </div>
  );
};