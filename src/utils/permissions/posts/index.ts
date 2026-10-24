import { can as create } from "./create";
import { can as read } from "./read";

export const postsPermissions = {
  "posts:create": create,
  "posts:read": read,
} as const;