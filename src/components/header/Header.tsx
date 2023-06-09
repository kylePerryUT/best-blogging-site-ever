import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../models/enums/paths";
import "./Header.css";
import { FaBlog } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Header: FC = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const username = authContext?.auth?.username;

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
      {!!username ? (
        <div className="navBtn" onClick={() => navigate("/posts/my-posts")}>
          {username}
        </div>
      ) : (
        <div className="navBtn loginBtn" onClick={() => navigate(Paths.LOGIN)}>
          Log in
        </div>
      )}
    </div>
  );
};

export default Header;
