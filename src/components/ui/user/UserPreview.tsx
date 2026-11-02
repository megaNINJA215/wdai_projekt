import { User } from '@/types/user';

export interface UserPreviewProps {
  data: User;
}

export default function UserPreview(props: UserPreviewProps) {
  return (
    <div>
      {JSON.stringify(props.data)}
    </div>
  );
};