import type {
  PermissionHandler,
} from "../types";

export const can: PermissionHandler = (
  user
) => {
  return !user;
};