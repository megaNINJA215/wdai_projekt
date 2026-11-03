"use server";

import UserFullView from "@/components/ui/user/UserFullView";
import UserPosts from "@/components/ui/user/UserPosts";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: Props) {
  const { username } = await params;

  return <div className="w-full max-w-220 mx-auto flex flex-col overflow-hidden h-[calc(100dvh-100px)]">
    <UserFullView user={{ username }} />
    <div className="mt-8 flex flex-col w-9/10 mx-auto text-sm text-primary-muted font-bold relative">
      Posty:
      <div className="h-1 bg-fg-hover rounded-full" />
      <div className="w-[102%] left-[-1%] h-8 bg-linear-to-b from-bg to-transparent z-9 absolute -bottom-8" />
    </div>
    <UserPosts username={username} />
  </div>;
}
