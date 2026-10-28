import { getCurrentUser } from "@/lib/auth/currentUser";
import ProfileButton from "./ProfileButton";
import LoginButton from "./LoginButton";

export async function UserButton() {
  const user = await getCurrentUser();

  if (user) {
    return <ProfileButton username={user.username} />;
  }

  return <LoginButton />;
}