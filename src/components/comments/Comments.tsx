import { FC } from "react";
import "./Comments.css";
import Comment from "../comment/Comment";
import { useComments } from "../../hooks/useComments";
import WriteComment from "../write-comment/WriteComment";

interface CommentsProps {
  postId: number;
}

const Comments: FC<CommentsProps> = ({ postId }) => {
  const { comments, handlePostComment } = useComments(postId);

  const renderComments = () =>
    comments.map((comment) => <Comment key={comment.id} comment={comment} />);

  return (
    <div className="Comments">
      <WriteComment onPostComment={handlePostComment} />
      <div className="verticalScroll commentsBox">
        {comments.length === 0 ? <div>No comments yet</div> : renderComments()}
      </div>
    </div>
  );
};

export default Comments;
