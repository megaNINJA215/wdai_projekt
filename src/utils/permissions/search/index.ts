import { can as autocomplete } from "./autocomplete";

export const searchPermissions = {
  "search:autocomplete": autocomplete,
} as const;