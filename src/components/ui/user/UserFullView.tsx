"use server";

import prisma from '@/lib/prisma/prisma';
import { User } from '@/types/user';
import LoadingInfo from '../LoadingInfo';
import ProfilePicture from '../ProfilePicture';

export interface UserFullViewProps {
  user: User;
}

export default async function UserFullView(props: UserFullViewProps) {

  const user = await prisma.users.findUnique({
    where: {
      username: props.user.username,
    },
    select: {
      username: true,
      created_at: true,
      id: true,
    },
  });

  if (!user) {
    return <div className="flex items-center justify-center w-full h-full">
      <LoadingInfo text={`Nie znaleziono użytkownika o nazwie ${props.user.username}.`} />
    </div>
  }

  const post_count = await prisma.posts.count({
    where: {
      author_id: user.id,
    },
  });

  const member_ship_count = await prisma.community_memberships.count({
    where: {
      user_id: user.id,
    },
  });

  return (
    <div className="flex sm:flex-row flex-col w-full mx-auto justify-between">
      <div className="flex-1 flex flex-row items-center text-clip">
        <div className="size-20 sm:size-24 md:size-32 shrink-0">
          <ProfilePicture
            type="user"
            name={user.username}
            size={128}
          />
        </div>
        <div className="flex flex-col justify-center ml-4 gap-2">
          <div className="text-primary text-lg sm:text-3xl font-bold wrap-anywhere sm:text-nowrap sm:text-[clamp(18px,2.5vw,30px)]">
            u/{user.username}
          </div>
          <div className="text-text-secondary text-sm sm:text-md">
            Dołączył: {user.created_at.toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-2 sm:mt-0 sm:items-end text-text-secondary text-sm sm:text-md  text-nowrap">
        <div>
          {formatPostsCount(post_count)}
        </div>
        <div>
          Członek {member_ship_count} społeczności
        </div>
      </div>
    </div>
  );
}

function formatPostsCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  const word =
    count === 1
      ? "post"
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? "posty"
        : "postów";

  return `Opublikował ${count} ${word}`;
}