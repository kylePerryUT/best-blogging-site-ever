import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { Post } from "../../models/interfaces/post";
import Posts from "../posts/Posts";
import "./MyPosts.css";
import AppContext from "../../context/app-context";

const MyPosts: FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const userState = useContext(AppContext)?.appState.userState;
  const loggedInUserId = useMemo(() => userState?.user.id, [userState]);

  // TODO: replace with posts from context
  const [posts, setPosts] = useState<Post[]>([]);
  const myPosts = useMemo(
    () => posts.filter((post) => post.user.id === loggedInUserId),
    [posts, loggedInUserId]
  );

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
    <div className="MyPosts">
      <h2>My Posts Page</h2>
      <Posts posts={myPosts} />
    </div>
  );
};

export default MyPosts;
