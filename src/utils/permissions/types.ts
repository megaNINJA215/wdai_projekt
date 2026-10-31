import { CurrentUser } from "@/types/currentUser";

export type PermissionContext = Record<string, unknown>;

export type PermissionHandler<
  Context extends PermissionContext = {},
> = (
  user: CurrentUser,
  context?: Context,
) => boolean | Promise<boolean>;