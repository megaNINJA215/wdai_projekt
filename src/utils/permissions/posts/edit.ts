import prisma from "@/lib/prisma/prisma";
import type {
  PermissionHandler,
} from "../types";

export type Context = {
  short_id: string;
};

export const can: PermissionHandler<Context> = async (
  user,
  context
) => {
  if (!context) {
    throw new Error("Context is required for posts:edit permission check");
  }

  const postAuthor = await prisma.posts.findUnique({
    where: {
      short_id: context.short_id as string,
    },
    select: {
      author_id: true,
    },
  });

  if (!postAuthor) { // nie powinno mieć miejsca
    return false;
  }

  return user?.id === postAuthor.author_id;
};