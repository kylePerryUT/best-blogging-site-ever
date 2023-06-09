import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { Post } from "../../models/interfaces/post";
import AuthContext from "../../context/auth-provider";
import Posts from "../posts/Posts";

const DiscoverPosts: FC = () => {
  const axiosPrivate = useAxiosPrivate();

  // TODO: replace with posts from context
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axiosPrivate
      .get("/posts")
      .then((response) => {
        // TODO set posts state in context
        setPosts(response.data.posts);
      })
      .catch((error) => console.error(error));
  }, [axiosPrivate]);

  return (
    <div className="DiscoverPosts">
      <h2>Discover Posts Page</h2>
      <Posts posts={posts} />
    </div>
  );
};

export default DiscoverPosts;
