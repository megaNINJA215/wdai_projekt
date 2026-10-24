import prisma from "@/lib/prisma/prisma";
import type {
  PermissionHandler,
} from "../../types";

export type Context = {
  communityID: string;
};

export const can: PermissionHandler<Context> = async (
  user,
  context
) => {
  if (!context) {
    throw new Error("Context is required for communities:posts:create permission check");
  }

  if (!user) {
    return false;
  }

  const isMember = await prisma.community_memberships.findUnique({
    where: {
      user_id_community_id: {
        user_id: user.id,
        community_id: context.communityID,
      },
    },
  });

  return !!isMember;
};