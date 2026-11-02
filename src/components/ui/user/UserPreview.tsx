import { User } from '@/types/user';
import ProfilePicture from '../ProfilePicture';
import Link from 'next/link';

export interface UserPreviewProps {
  data: User;
}

export default function UserPreview(props: UserPreviewProps) {
  return (
    <div className="mx-auto hover:bg-bg-hover transition-colors duration-200 flex flex-col py-2 rounded-4xl w-full sm:w-4/5">
      <Link href={`/c/${props.data.username}`} className="absolute inset-0 z-2 rounded-4xl" aria-label={`Przejdź do społeczności ${props.data.username}`} />
      <div className="flex flex-row gap-2 items-center px-2">
        <ProfilePicture type="user" name={props.data.username} size={48} />

        <div className="flex flex-col whitespace-nowrap">
          <span className="font-bold text-primary text-xl z-5">
            c/{props.data.username}
          </span>
        </div>
      </div>
      <div className="absolute -bottom-5.25 w-full sm:w-4/5 h-0.5 bg-border rounded-full" />
    </div>
  );
};