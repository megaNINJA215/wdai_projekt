import type {
  PermissionHandler,
} from "../../types";

export const can: PermissionHandler = async (
  user
) => {
  // TODO do sprawdzenia czy użytkownik należy do społeczności

  return !!user;
};