import React, { FC } from "react";
import "./Posts.css";
import { Post } from "../../models/interfaces/post";

interface PostsProps {
  posts: Post[];
}

const Posts: FC<PostsProps> = ({ posts }) => {
  const renderPosts = () =>
    posts.map((post) => (
      <div>
        <h3>This is a post body</h3>
        <h4>{post.body}</h4>
      </div>
    ));

  return (
    <div className="DiscoverPosts">
      <div>{renderPosts()}</div>
    </div>
  );
};

export default Posts;
