"use server";

import prisma from '@/lib/prisma/prisma';
import LoadingInfo from '../LoadingInfo';
import ProfilePicture from '../ProfilePicture';
import { getCurrentUser } from '@/lib/auth/currentUser';
import SeparatorButtons from './CommunityButtons';

export interface CommunityFullViewProps {
  name: string;
}

export default async function CommunityFullView(props: CommunityFullViewProps) {

  const community = await prisma.communities.findUnique({
    where: {
      name: props.name,
    },
    select: {
      name: true,
      description: true,
      created_at: true,
      id: true,
    },
  });

  if (!community) {
    return <div className="flex items-center justify-center w-full h-full">
      <LoadingInfo text={`Nie znaleziono społeczności o nazwie ${props.name}.`} />
    </div>
  }

  const post_count = await prisma.posts.count({
    where: {
      community_id: community.id,
    },
  });

  const member_ship_count = await prisma.community_memberships.count({
    where: {
      community_id: community.id,
    },
  });

  const current_user = await getCurrentUser();

  const is_member = current_user ? !!(await prisma.community_memberships.findUnique({
    where: {
      user_id_community_id: {
        user_id: current_user.id,
        community_id: community.id,
      },
    },
  })) : null

  return (
    <div className="relative">
      <div className="w-full mx-auto justify-between flex flex-row">
        <div className="flex-1 flex flex-row items-center text-clip">
          <div className="size-20 sm:size-24 md:size-32 shrink-0">
            <ProfilePicture
              type="community"
              name={community.name}
              size={128}
            />
          </div>
          <div className="flex flex-col justify-center ml-4 gap-2">
            <div className="text-primary text-lg sm:text-3xl font-bold wrap-anywhere sm:text-nowrap sm:text-[clamp(18px,2.5vw,30px)]">
              u/{community.name}
            </div>
            <div className="text-text-secondary text-sm sm:text-md">
              Utworzono: {community.created_at.toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-2 sm:mt-0 sm:items-end text-text-secondary text-sm sm:text-md  text-nowrap">
          <div>
            {formatPostsCount(post_count)}
          </div>
          <div>
            {formatMembershipCount(member_ship_count)}
          </div>
        </div>
      </div>
      <div className="text-text-secondary text-md mx-6 py-2">
        {community.description && (
          <span className="line-clamp-4 sm:line-clamp-6 2xl:line-clamp-none">
            {community.description}
          </span>
        )}
      </div>
      {is_member !== null && <SeparatorButtons name={props.name} is_member={is_member} />}
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

  return `${count} ${word}`;
}

function formatMembershipCount(count: number): string {
  const postfix = count >= 1000000 ? "m" : count >= 1000 ? "k" : "";
  const formattedCount = postfix ? (count / (postfix === "m" ? 1000000 : 1000)).toFixed(1) : count.toString();

  const word =
    count === 1
      ? "członek"
      : "członków";

  return `${formattedCount}${postfix} ${word}`;
}