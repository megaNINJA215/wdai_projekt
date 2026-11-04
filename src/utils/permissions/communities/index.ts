import { can as create } from "./create";
import { can as about } from "./about";
import { can as edit } from "./edit";
import { can as personalized } from "./personalized";
import { can as discover } from "./discover";
import { communitiesPostsPermissions as postsPermissions } from "./posts";
import { communitiesMembershipPermissions as membershipPermissions } from "./membership";

export const communitiesPermissions = {
  "communities:create": create,
  "communities:about": about,
  "communities:edit": edit,
  "communities:personalized": personalized,
  "posts:discover": discover,
  ...membershipPermissions,
  ...postsPermissions,
} as const;