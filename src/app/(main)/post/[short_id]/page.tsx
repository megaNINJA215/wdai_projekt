import 'server-only';

import { getCurrentUser } from "@/lib/auth/currentUser";
import prisma from '@/lib/prisma/prisma';
import InfoText from '@/components/ui/InfoText';
import PostFullView from '@/components/ui/post/PostFullView';

type Props = {
  params: Promise<{ short_id: string }>;
};

export default async function CommunityPage({ params }: Props) {
  const { short_id } = await params;
  const user = await getCurrentUser();


  const postData = await prisma.posts.findUnique({
    where: {
      short_id: short_id,
    },
    select: {
      users: {
        select: {
          username: true,
          id: true,
        },
      },
      id: true,
      title: true,
      content: true,
      created_at: true,
      edited_at: true,
      short_id: true,
      communities: {
        select: {
          name: true,
        },
      }
    },
  });

  if (!postData) {
    return <InfoText text="Post nie istnieje. :c" />;
  }

  const { users: author, communities: community, ...post } = postData;

  let isSaved = user
    ? !!(await prisma.saved_posts.findUnique({
      where: {
        user_id_post_id: {
          user_id: user.id,
          post_id: post.id,
        },
      },
    }))
    : false

  return (
    <PostFullView authorUsername={author.username} communityName={community?.name} post={(({ id: _, ...rest }) => rest)(post)} isAuthor={user?.id === author.id} isSaved={isSaved} isLoggedIn={!!user} />
  );
}