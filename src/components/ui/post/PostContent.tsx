import React from 'react';
import FormattedText from '../FormattedText';

export interface PostContentProps {
  title: string;
  content: string;
  clampLines?: number;
  setIsClamped?: (value: React.SetStateAction<boolean>) => void;
}

export default function PostContent(props: PostContentProps) {
  return (
    <div className="px-4 my-2 pb-1">
      <h1 className="text-2xl font-bold mb-2 wrap-anywhere">{props.title}</h1>
      <FormattedText text={props.content} style="text-md text-text-muted" clampLines={props.clampLines} setIsClamped={props.setIsClamped} />
    </div>
  );
};