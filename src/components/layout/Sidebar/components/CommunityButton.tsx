import ProfilePicture from "@/components/ui/ProfilePicture";
import Link from "next/link";

export interface CommunityButtonProps {
  name: string;
}

export default function CommunityButton(props: CommunityButtonProps) {
  return (
    <Link href={`/c/${props.name}`} className="w-9/10 mx-auto h-10 flex items-center rounded-lg text-md font-semibold text-primary hover:bg-fg transition-colors hover:cursor-pointer p-2">
      <ProfilePicture type="community" name={props.name} size={28} />
      <span className="truncate ml-2 h-full flex items-center">c/<span className="truncate text-text">{props.name}</span></span>
    </Link>
  );
};