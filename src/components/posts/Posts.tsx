import React, { FC } from "react";
import "./Posts.css";
import { Post } from "../../models/interfaces/post";
import PostOverview from "../post-overview/PostOverview";

interface PostsProps {
  posts: Post[];
}

const Posts: FC<PostsProps> = ({ posts }) => {
  const renderPosts = () =>
    posts.map((post) => <PostOverview key={post.id} post={post} />);

  return <div className="Posts">{renderPosts()}</div>;
};

export default Posts;
