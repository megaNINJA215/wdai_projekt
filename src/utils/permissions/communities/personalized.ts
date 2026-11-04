import type {
  PermissionHandler,
} from "../types";

export const can: PermissionHandler = async (user) => {
  return !!user;
};