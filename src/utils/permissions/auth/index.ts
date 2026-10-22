import { can as login } from "./login";
import { can as register } from "./register";
import { can as logout } from "./logout";

export const authPermissions = {
  "auth:login": login,
  "auth:register": register,
  "auth:logout": logout,
} as const;