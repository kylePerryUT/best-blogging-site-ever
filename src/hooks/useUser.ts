import { useContext } from "react";
import AppContext from "../context/app-context";

const useUser = () => useContext(AppContext)?.appState.userState;

export default useUser;
