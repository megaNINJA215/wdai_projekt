import { can as create } from "./create";
import { can as get } from "./get";

export const communitiesPostsPermissions = {
  "communities:posts:create": create,
  "communities:posts:get": get,
} as const;