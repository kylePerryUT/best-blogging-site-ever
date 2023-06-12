import { FC } from "react";
import { Comment as CommentType } from "../../models/interfaces/comment";
import dayjs from "dayjs";
import "./Comment.css";

interface CommentProps {
  comment: CommentType;
}

const Comment: FC<CommentProps> = ({ comment }) => {
  return (
    <div className="Comment">
      <div className="header">
        <div>{dayjs(comment.created_at).format("MMM D YYYY")}</div>
        <div>{comment.user.display_name}</div>
      </div>
      <div className="body">{comment.content}</div>
    </div>
  );
};

export default Comment;
