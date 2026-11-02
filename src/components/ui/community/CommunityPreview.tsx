import { Community } from '@/types/community';
import React from 'react';

export interface CommunityPreviewProps {
  data: Community;
}

export default function CommunityPreview(props: CommunityPreviewProps) {
  return (
    <div>
      {JSON.stringify(props.data)}
    </div>
  );
};