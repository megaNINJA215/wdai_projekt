"use server";

import CommunityFullView from "@/components/ui/community/CommunityFullView";
import CommunityPosts from "@/components/ui/community/CommunityPosts";
import CommunitySeparator from "@/components/ui/community/CommunitySeparator";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function CommunityPage({ params }: Props) {
  const { name } = await params;

  return <div className="w-full max-w-220 mx-auto flex flex-col overflow-hidden h-[calc(100dvh-100px)]">
    <CommunityFullView name={name} />
    <CommunitySeparator />
    <CommunityPosts name={name} />
  </div>;
}