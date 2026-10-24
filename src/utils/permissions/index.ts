import { getCurrentUser } from "@/lib/auth/currentUser";
import { authPermissions } from "./auth";
import { usersPermissions } from "./users";
import { communitiesPermissions } from "./communities";
import { postsPermissions } from "./posts";

const handlers = {
  ...authPermissions,
  ...usersPermissions,
  ...communitiesPermissions,
  ...postsPermissions,
};

export async function can(
  action: keyof typeof handlers,
  context?: Record<string, unknown>,
): Promise<boolean> {
  const handler = handlers[action];

  return handler(await getCurrentUser(), context as never);
}