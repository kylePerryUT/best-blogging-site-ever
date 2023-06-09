import { useContext } from "react";
import AppContext from "../context/app-context";

const useAuth = () => useContext(AppContext)?.appState.authState;

export default useAuth;
