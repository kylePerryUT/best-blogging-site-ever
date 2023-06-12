import React, { FC, useEffect, useMemo, useState } from "react";
import "./Post.css";
import { Post as PostType } from "../../models/interfaces/post";
import usePosts from "../../hooks/usePosts";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import Comments from "../comments/Comments";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import usePost from "../../hooks/usePost";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";

const Post: FC = () => {
  const navigate = useNavigate();
  const authState = useAuth();
  const userState = useUser();
  const postsState = usePosts();
  const { postId } = useParams();
  const postIdNum = useMemo(() => {
    return Number.parseInt(postId ?? "");
  }, [postId]);
  const { updatingPost, updatePost, deletingPost, deletePost } =
    usePost(postIdNum);

  const [post, setPost] = useState<PostType>();
  const [showComments, setShowComments] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>(post?.title ?? "");
  const [postBody, setPostBody] = useState<string>(post?.body ?? "");

  const handleEditPost = () => {
    setEditMode(true);
  };

  const handleUpdatePost = async () => {
    const updateSuccess = await updatePost(postTitle, postBody);
    // if (updateSuccess) navigate(0);
    setEditMode(false);
  };

  const handleDeletePost = async () => {
    const deleteSuccess = await deletePost();
    if (deleteSuccess) navigate("/");
  };

  useEffect(() => {
    const postData = postsState?.posts.get(postIdNum);
    setPost(postData);

    setPostTitle(postData?.title ?? "");
    setPostBody(postData?.body ?? "");

    if (!postData) {
      navigate("/");
    }
  }, []);

  const renderEditAndDeleteBtns = () => {
    if (
      !!authState?.auth.token &&
      !!userState?.user.id &&
      !!post?.user.id &&
      userState.user.id === post.user.id
    ) {
      return (
        <div className="editAndDeleteBtns">
          {editMode ? (
            <AiOutlineSave className="iconButton" onClick={handleUpdatePost} />
          ) : (
            <AiOutlineEdit className="iconButton" onClick={handleEditPost} />
          )}
          <AiOutlineDelete className="iconButton" onClick={handleDeletePost} />
        </div>
      );
    }
  };

  return (
    <div className="Post">
      <div className="header">
        <div className="metaInfo">
          <input
            className="title"
            type="text"
            value={postTitle}
            onChange={(event) => setPostTitle(event.target.value)}
          />
          <div className="createdDate">
            Post date: {dayjs(post?.created_at).format("MMM D YYYY")}
          </div>
          <div className="userName">Author: {post?.user.display_name}</div>
        </div>
      </div>
      <textarea
        className="postBody verticalScroll"
        value={postBody}
        onChange={(event) => setPostBody(event.target.value)}
      />
      <div className="postFooter">
        <FaRegComments
          className="iconButton"
          onClick={() => setShowComments(!showComments)}
        />
        {renderEditAndDeleteBtns()}
      </div>
      {showComments && <Comments postId={postIdNum} />}
    </div>
  );
};

export default Post;
