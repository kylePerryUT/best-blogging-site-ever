import { CommentUser } from "./comment-user";

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
  user: CommentUser;
}
