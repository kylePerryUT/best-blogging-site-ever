import React, { FC, useEffect, useMemo, useState } from "react";
import "./Post.css";
import { Post as PostType } from "../../models/interfaces/post";
import usePosts from "../../hooks/usePosts";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import Comments from "../comments/Comments";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";

const Post: FC = () => {
  const navigate = useNavigate();
  const postsState = usePosts();
  const { postId } = useParams();
  const postIdNum = useMemo(() => {
    return Number.parseInt(postId ?? "");
  }, [postId]);

  const [post, setPost] = useState<PostType>();
  const [showComments, setShowComments] = useState<boolean>(false);

  useEffect(() => {
    const postData = postsState?.posts.get(postIdNum);
    setPost(postData);

    if (!postData) {
      navigate("/");
    }
  }, []);

  return (
    <div className="Post">
      <div className="header">
        <div className="metaInfo">
          <div className="title">{post?.title}</div>
          <div className="createdDate">
            Post date: {dayjs(post?.created_at).format("MMM D YYYY")}
          </div>
          <div className="userName">Author: {post?.user.display_name}</div>
        </div>
      </div>
      <div className="postBody verticalScroll">{post?.body}</div>
      <div className="footer">
        <FaRegComments
          className="iconButton"
          onClick={() => setShowComments(!showComments)}
        />
        <div className="editAndDeleteBtns">
          <AiOutlineEdit className="primaryButton" />
          <AiOutlineDelete className="primaryButton" />
        </div>
      </div>
      {showComments && <Comments postId={postIdNum} />}
    </div>
  );
};

export default Post;
