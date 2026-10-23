import { can as me } from "./me";
import { can as getInfo } from "./getInfo";

export const usersPermissions = {
  "users:me": me,
  "users:getInfo": getInfo,
} as const;