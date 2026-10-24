import { can as get } from "./get";

export const usersPostsPermissions = {
  "users:posts:get": get,
} as const;