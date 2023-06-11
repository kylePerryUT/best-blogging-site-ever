import React, { FC } from "react";
import "./Post.css";
import usePosts from "../../hooks/usePosts";
import { useParams } from "react-router";

const Post: FC = () => {
  const postsState = usePosts();

  const { postId } = useParams();

  const post = postsState?.posts.get(Number.parseInt(postId ?? ""));

  return (
    <div className="Post">
      <h1>Post Details Page</h1>
      <div className="title">{post?.title}</div>
    </div>
  );
};

export default Post;
