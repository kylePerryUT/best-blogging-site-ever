import { FC } from "react";
import Posts from "../posts/Posts";
import "./DiscoverPosts.css";

const DiscoverPosts: FC = () => {
  return (
    <div className="DiscoverPosts">
      <h2>Discover Posts Page</h2>
      <Posts />
    </div>
  );
};

export default DiscoverPosts;
