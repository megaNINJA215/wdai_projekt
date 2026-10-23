import prisma from "@/lib/prisma/prisma";
import type {
  PermissionHandler,
} from "../types";

export type Context = {
  communityName: string;
};

export const can: PermissionHandler<Context> = async (
  user,
  context
) => {
  if (!context) {
    throw new Error("Context is required for communities:edit permission check");
  }

  const communityOwner = await prisma.communities.findUnique({
    where: {
      name: context.communityName as string,
    },
    select: {
      owner_id: true,
    },
  });

  if (!communityOwner) { // nie powinno mieć miejsca
    return false;
  }

  return user?.id === communityOwner.owner_id;
};