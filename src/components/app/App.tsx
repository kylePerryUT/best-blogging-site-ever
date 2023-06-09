import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthenticatedUser } from "../../models/interfaces/authenticated-user";
import Header from "../header/Header";
import "./App.css";

const CurrentUserContext = createContext<any>(null);

function App() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
    null
  );

  return (
    <div className="App">
      <Header />
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
        }}
      >
        <Outlet />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
