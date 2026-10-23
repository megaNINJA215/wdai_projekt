import { getCurrentUser } from "@/lib/auth/currentUser";
import { authPermissions } from "./auth";
import { usersPermissions } from "./users";

const handlers = {
  ...authPermissions,
  ...usersPermissions
};

export async function can(
  action: keyof typeof handlers,
  context?: Record<string, unknown>,
): Promise<boolean> {
  const handler = handlers[action];

  return handler(await getCurrentUser(), context as never);
}