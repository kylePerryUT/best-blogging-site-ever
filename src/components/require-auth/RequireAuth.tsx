import { useLocation, Navigate, Outlet } from "react-router-dom";
import AppContext from "../../context/app-context";
import { useContext } from "react";

const RequireAuth = () => {
  const authState = useContext(AppContext)?.appState.authState;
  const location = useLocation();

  return !!authState?.auth.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
