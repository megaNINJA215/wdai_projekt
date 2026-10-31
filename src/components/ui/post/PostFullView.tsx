"use client";

import PostHeader from './PostHeader';
import PostContent from './PostContent';
import Share from './icons/share';
import Save from './icons/save';
import { useState } from 'react';
import InfoText from '../InfoText';
import Edit from './icons/edit';

export interface PostFullViewProps {
  authorUsername: string;
  communityName: string | undefined;
  post: {
    short_id: string;
    title: string;
    content: string;
    created_at: Date;
    edited_at: Date | null;
  };
  isAuthor: boolean;
  isSaved: boolean;
  isLoggedIn: boolean;
}

export default function PostFullView(props: PostFullViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col items-center w-full  mb-20 h-full">
      <div className="border-3 border-border rounded-4xl bg-fg w-full max-w-200">
        <PostHeader
          authorUsername={props.authorUsername}
          created_at={props.post.created_at}
          communityName={props.communityName}
          edited_at={props.post.edited_at}
        />

        <div className="h-1 w-[calc(100%-4rem)] bg-fg-hover mx-8 rounded-full" />
        {isEditing ? <>
          <InfoText text="TODO: implement edit post" />

          <button
            className="hover:cursor-pointer hover:bg-fg-hover rounded-full px-2"
            onClick={() => setIsEditing(false)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 m-0.5">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g id="Edit / Edit_Pencil_Line_01">
                  <path id="Vector" d="M4 20.0001H20M4 20.0001V16.0001L12 8.00012M4 20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </g>
            </svg>
          </button>
        </>
          : <>
            <PostContent title={props.post.title} content={props.post.content} />

            <div className="w-full h-10 text-center bg-fg-muted rounded-b-4xl relative
                        before:content-[''] before:absolute before:-top-6 before:left-0 before:w-full before:h-6
                        before:bg-linear-to-t before:from-fg-muted before:to-transparent
                        flex flex-row items-center justify-end gap-2 text-primary text-md font-semibold pr-4">
              {props.isAuthor && (
                <Edit setIsEditing={setIsEditing} />
              )}
              <Share />
              {props.isLoggedIn && <Save short_id={props.post.short_id} isSaved={props.isSaved} />}
            </div>
          </>
        }
      </div >
    </div >
  );
};