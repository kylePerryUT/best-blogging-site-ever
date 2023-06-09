import { useContext } from "react";
import AppContext from "../context/app-context";

const usePosts = () => useContext(AppContext)?.appState.postsState;

export default usePosts;
