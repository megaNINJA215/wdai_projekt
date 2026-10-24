import { can as create } from "./create";
import { can as read } from "./read";
import { can as edit } from "./edit";

export const postsPermissions = {
  "posts:create": create,
  "posts:read": read,
  "posts:edit": edit,
} as const;