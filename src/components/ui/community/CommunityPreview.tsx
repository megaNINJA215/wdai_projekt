import { Community } from '@/types/community';
import ProfilePicture from '../ProfilePicture';
import Link from 'next/link';

export interface CommunityPreviewProps {
  data: Community;
}

export default function CommunityPreview(props: CommunityPreviewProps) {
  return (
    <div className="mx-auto hover:bg-bg-hover transition-colors duration-200 flex flex-col py-2 rounded-4xl w-full sm:w-4/5">
      <Link href={`/c/${props.data.name}`} className="absolute inset-0 z-2 rounded-4xl" aria-label={`Przejdź do społeczności ${props.data.name}`} />
      <div className="flex flex-row gap-2 items-center px-2">
        <ProfilePicture type="community" name={props.data.name} size={48} />

        <div className="flex flex-col whitespace-nowrap">
          <span className="font-bold text-primary text-xl z-5">
            c/{props.data.name}
          </span>
        </div>
      </div>
      {props.data.description && (
        <span className="text-text-secondary text-md line-clamp-2 px-6 py-2">
          {props.data.description}
        </span>
      )}
      <div className="absolute -bottom-5.25 w-full sm:w-4/5 h-0.5 bg-border rounded-full" />
    </div>
  );
};