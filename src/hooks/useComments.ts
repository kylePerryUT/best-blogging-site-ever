import { useContext } from "react";
import AppContext from "../context/app-context";

const useComments = () => useContext(AppContext)?.appState.commentsState;

export default useComments;
