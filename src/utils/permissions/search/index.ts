import { can as autocomplete } from "./autocomplete";
import { can as users } from "./users";
import { can as posts } from "./posts";
import { can as communities } from "./communities";

export const searchPermissions = {
  "search:autocomplete": autocomplete,
  "search:users": users,
  "search:posts": posts,
  "search:communities": communities,
} as const;