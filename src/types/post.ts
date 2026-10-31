export type Post = {
  short_id: string;
  title: string;
  content: string;
  author: string;
  created_at: Date;
  community?: string;
  edited_at: Date | null;
}