import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../models/enums/paths";
import "./Header.css";
import { FaBlog } from "react-icons/fa";

const Header: FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  // TODO: get from logged in user
  const user = { name: "Kyle Perry" };

  return (
    <div className="Header">
      <div className="iconAndNavBtns">
        <div className="icon">
          <FaBlog />
        </div>
        <div className="navBtn" onClick={() => navigate(Paths.POSTS)}>
          Discover
        </div>
        <div className="navBtn" onClick={() => navigate(Paths.WRITE_POST)}>
          Write
        </div>
      </div>
      {loggedIn ? (
        <div className="navBtn">{user.name}</div>
      ) : (
        <div className="navBtn loginBtn" onClick={() => navigate(Paths.LOGIN)}>
          Log in
        </div>
      )}
    </div>
  );
};

export default Header;
