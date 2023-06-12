import { FC, useState } from "react";
import "./WriteComment.css";
import useAuth from "../../hooks/useAuth";

interface WriteCommentProps {
  onPostComment: (commentBody: string) => void;
}

const WriteComment: FC<WriteCommentProps> = ({ onPostComment }) => {
  const authState = useAuth();
  const [comment, setComment] = useState<string>("");
  return (
    <div className="WriteComment">
      {authState?.auth.token === null ? (
        <div className="loginText">
          <a href="/login">Login</a> to post a comment
        </div>
      ) : (
        <form className="commentForm">
          <input
            className="commentInput"
            type="textarea"
            id="comment"
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <div
            className="primaryButton postButton"
            onClick={() => onPostComment(comment)}
          >
            Comment
          </div>
        </form>
      )}
    </div>
  );
};

export default WriteComment;
