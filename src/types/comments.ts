import { User } from "./user";

export type CommentType = {
    id: string;
    content: string;
    created_at: Date;
    parent_comment_id: string | null;
    parent_author_username: string | null;
    replies_count: number;
    author: User;
};
