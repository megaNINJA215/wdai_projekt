import Link from "next/link";

export interface CreatePostButtonProps {
  community_name: string;
}

export default function CreatePostButton(props: CreatePostButtonProps) {
  return (
    <Link href={`/post/create-post?c=${props.community_name}`} className="bg-primary text-text px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:cursor-pointer hover:bg-primary-hover h-8 sm:h-10">
      Utwórz post
    </Link>
  );
};