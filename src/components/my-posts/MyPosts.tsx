import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { Post } from "../../models/interfaces/post";
import AuthContext from "../../context/auth-provider";
import Posts from "../posts/Posts";

const MyPosts: FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const authContext = useContext(AuthContext);
  const loggedInUserId = useMemo(() => authContext?.auth.id, [authContext]);

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
