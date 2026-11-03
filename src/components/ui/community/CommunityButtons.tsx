"use client";

import { useState } from 'react';
import CreatePostButton from './CreatePostButton';
import MembershipButton from './MembershipButton';

export interface CommunityButtonsProps {
  is_member: boolean;
  name: string;
}

export default function CommunityButtons(props: CommunityButtonsProps) {
  const [is_member, setIsMember] = useState(props.is_member);
  return (
    <div className="flex gap-4 absolute -bottom-10 right-0">
      {is_member && <CreatePostButton community_name={props.name} />}
      {<MembershipButton community_name={props.name} is_member={is_member} setIsMember={setIsMember} />}
    </div>
  );
};