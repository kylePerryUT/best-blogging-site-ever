import { useLocation, Navigate, Outlet } from "react-router-dom";
import AppContext from "../../context/app-context";
import { useContext } from "react";

const RequireAuth = () => {
  const userState = useContext(AppContext)?.appState.userState;
  const location = useLocation();

  return userState?.user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
