import { useContext } from "react";
import AuthContext from "../context/auth-provider";

const useAuth = () => useContext(AuthContext);

export default useAuth;
