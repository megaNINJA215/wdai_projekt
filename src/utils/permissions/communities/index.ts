import { can as create } from "./create";
import { can as about } from "./about";

export const communitiesPermissions = {
  "communities:create": create,
  "communities:about": about,
} as const;