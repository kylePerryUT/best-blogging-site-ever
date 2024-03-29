import { User } from "./user";

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
  user: User;
}
