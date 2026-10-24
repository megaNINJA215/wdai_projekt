import { can as join } from "./join";
import { can as quit } from "./quit";
import { can as get } from "./get";

export const communitiesMembershipPermissions = {
  "communities:membership:join": join,
  "communities:membership:quit": quit,
  "communities:membership:get": get,
} as const;