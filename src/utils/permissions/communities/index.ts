import { can as create } from "./create";

export const communitiesPermissions = {
  "communities:create": create,
} as const;