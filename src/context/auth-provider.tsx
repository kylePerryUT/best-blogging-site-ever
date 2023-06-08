import React, { createContext, useState, FC, ReactNode } from "react";
import { AuthenticatedUser } from "../models/interfaces/authenticated-user-type";
// TODO: update the type
const AuthContext = createContext<{
  auth: AuthenticatedUser | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthenticatedUser | null>>;
} | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthenticatedUser | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
