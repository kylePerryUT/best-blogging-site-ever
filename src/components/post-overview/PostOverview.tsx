import React, { FC } from "react";
import "./PostOverview.css";
import { Post as PostType } from "../../models/interfaces/post";
import dayjs from "dayjs";

interface PostOverviewProps {
  post: PostType;
}

const PostOverview: FC<PostOverviewProps> = ({ post }) => {
  return (
    <div className="PostOverview">
      <div className="title">{post.title}</div>
      <div className="username">{post.user?.display_name ?? "No username"}</div>
      <div className="createdDate">
        {dayjs(post.created_at).format("MMM D YYYY")}
      </div>
      <div className="body">{post.body}</div>
    </div>
  );
};

export default PostOverview;
