import { FC, useContext } from "react";
import { Post } from "../../models/interfaces/post";
import Posts from "../posts/Posts";
import "./MyPosts.css";
import AppContext from "../../context/app-context";

const MyPosts: FC = () => {
  const userState = useContext(AppContext)?.appState.userState;

  return (
    <div className="MyPosts">
      <Posts filter={(post: Post) => post.user.id === userState?.user.id} />
    </div>
  );
};

export default MyPosts;
