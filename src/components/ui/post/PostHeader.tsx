import { cn } from '@/utils/cn';
import { getRelativeTime } from '@/utils/formatRelativeTime';
import ProfilePicture from '../ProfilePicture';
import Link from 'next/link';

export interface PostHeaderProps {
  authorUsername: string;
  created_at: Date;
  communityName?: string;
  edited_at: Date | null;
}

export default function PostHeader(props: PostHeaderProps) {
  return (
    <div className="flex flex-row items-end justify-between w-[calc(100%-2rem)] m-4">
      <div className="flex flex-row gap-2">

        {props.communityName ? <>

          <Link href={`c/${props.communityName}`} className="z-5">
            <ProfilePicture type="community" name={props.communityName} size={48} />
          </Link>
          <div className="flex flex-col whitespace-nowrap">
            <Link href={`/c/${props.communityName}`} className="font-bold text-primary text-lg z-5">
              c/{props.communityName}
            </Link>
            <Link href={`/u/${props.authorUsername}`} className="text-sm text-text-secondary z-5">
              u/{props.authorUsername}
            </Link>
          </div>

        </> : <>

          <Link href={`u/${props.authorUsername}`} className="z-5">
            <ProfilePicture type="user" name={props.authorUsername} size={48} />
          </Link>
          <div className="flex items-center whitespace-nowrap ">
            <Link href={`/u/${props.authorUsername}`} className="font-bold text-primary text-lg z-5">
              u/{props.authorUsername}
            </Link>
          </div>

        </>}

      </div>
      <div className="flex-col text-end text-text-secondary flex line-clamp-1">

        <span className="">
          {getRelativeTime(props.created_at)}
        </span>
        <span className={cn("text-xs", props.edited_at ? "visible" : "invisible")}>
          Edited: {props.edited_at ? getRelativeTime(props.edited_at) : ""}
        </span>

      </div>
    </div>
  );
};