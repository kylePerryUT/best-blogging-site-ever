import { FC } from "react";
import "./Comments.css";
import Comment from "../comment/Comment";
import { useComments } from "../../hooks/useComments";
import WriteComment from "../write-comment/WriteComment";
import { ColorRing } from "react-loader-spinner";

interface CommentsProps {
  postId: number;
}

const Comments: FC<CommentsProps> = ({ postId }) => {
  const {
    loading,
    comments,
    handlePostComment,
    isMoreComments,
    fetchNextCommentPage,
  } = useComments(postId);

  const renderComments = () =>
    comments.map((comment) => <Comment key={comment.id} comment={comment} />);

  return (
    <div className="Comments">
      <WriteComment onPostComment={handlePostComment} />
      <div className="scrollContainer">
        <div className="verticalScroll commentsBox">
          {comments.length === 0 ? (
            <div>No comments yet</div>
          ) : (
            renderComments()
          )}
        </div>
      </div>
      {isMoreComments ? (
        <button
          className="primaryButton alignSelfFlexEnd loadMoreBtn"
          onClick={fetchNextCommentPage}
          disabled={loading}
        >
          {loading ? (
            <ColorRing
              visible={true}
              height="24"
              width="24"
              ariaLabel="blocks-loading"
              // wrapperStyle={{}}
              // wrapperClass="blocks-wrapper"
              colors={["#eeead9", "#eeead9", "#eeead9", "#eeead9", "#eeead9"]}
            />
          ) : (
            "Load more comments"
          )}
        </button>
      ) : (
        <div className="alignSelfFlexEnd">Showing all comments</div>
      )}
    </div>
  );
};

export default Comments;
