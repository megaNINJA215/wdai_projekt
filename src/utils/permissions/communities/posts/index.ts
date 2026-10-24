import { can as create } from "./create";

export const communitiesPostsPermissions = {
  "communities:posts:create": create,
} as const;