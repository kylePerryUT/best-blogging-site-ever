import React, { createContext, useState, FC, ReactNode } from "react";
import { AuthenticatedUser } from "../models/interfaces/authenticated-user";

// TODO: update the type
const AuthContext = createContext<{
  auth: AuthenticatedUser;
  setAuth: React.Dispatch<React.SetStateAction<AuthenticatedUser>>;
} | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AUTHENTICATED_USER_DEFAULT_STATE: AuthenticatedUser = {
  id: null,
  username: null,
  accessToken: null,
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthenticatedUser>(
    AUTHENTICATED_USER_DEFAULT_STATE
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
