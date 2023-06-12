import { FC } from "react";
import { Comment as CommentType } from "../../models/interfaces/comment";
import "./Comment.css";

interface CommentProps {
  comment: CommentType;
}

const Comment: FC<CommentProps> = ({ comment }) => {
  return <div>{comment.content}</div>;
};

export default Comment;
