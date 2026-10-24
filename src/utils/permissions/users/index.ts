import { can as me } from "./me";
import { can as getInfo } from "./getInfo";
import { usersPostsPermissions } from "./posts";


export const usersPermissions = {
  "users:me": me,
  "users:getInfo": getInfo,
  ...usersPostsPermissions,
} as const;