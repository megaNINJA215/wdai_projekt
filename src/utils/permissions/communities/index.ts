import { can as create } from "./create";
import { can as about } from "./about";
import { can as edit } from "./edit";

export const communitiesPermissions = {
  "communities:create": create,
  "communities:about": about,
  "communities:edit": edit,
} as const;