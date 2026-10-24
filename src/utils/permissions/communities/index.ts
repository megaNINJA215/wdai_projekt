import { can as create } from "./create";
import { can as about } from "./about";
import { can as edit } from "./edit";
import { communitiesPostsPermissions as postsPermissions } from "./posts";
import { communitiesMembershipPermissions as membershipPermissions } from "./membership";

export const communitiesPermissions = {
  "communities:create": create,
  "communities:about": about,
  "communities:edit": edit,
  ...membershipPermissions,
  ...postsPermissions,
} as const;