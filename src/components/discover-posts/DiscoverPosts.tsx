import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { Post } from "../../models/interfaces/post";
import Posts from "../posts/Posts";
import usePosts from "../../hooks/usePosts";

const DiscoverPosts: FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const postsContext = usePosts();

  // TODO: replace with posts from context

  useEffect(() => {
    axiosPrivate
      .get("/posts")
      .then((response) => {
        // TODO set posts state in context
        postsContext?.setPosts(response.data.posts);
      })
      .catch((error) => console.error(error));
  }, [axiosPrivate]);

  return (
    <div className="DiscoverPosts">
      <h2>Discover Posts Page</h2>
      <Posts posts={postsContext?.posts ?? []} />
    </div>
  );
};

export default DiscoverPosts;
