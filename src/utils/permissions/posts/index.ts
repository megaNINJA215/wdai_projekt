import { can as create } from "./create";
import { can as read } from "./read";
import { can as edit } from "./edit";
import { can as personalized } from "./personalized";

export const postsPermissions = {
  "posts:create": create,
  "posts:read": read,
  "posts:edit": edit,
  "posts:personalized": personalized,
} as const;