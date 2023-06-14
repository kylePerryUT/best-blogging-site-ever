import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../models/enums/paths";
import "./Header.css";
import { FaBlog } from "react-icons/fa";
import useUser from "../../hooks/useUser";

const Header: FC = () => {
  const userContext = useUser();
  const navigate = useNavigate();
  const username = userContext?.user?.display_name;

  return (
    <div className="Header">
      <div className="iconAndNavBtns">
        <div className="icon">
          <FaBlog />
        </div>
        <div className="headerButtons">
          <div className="navBtns">
            <div
              className="primaryButton"
              onClick={() => navigate(Paths.POSTS)}
            >
              Discover
            </div>
            <div
              className="primaryButton"
              onClick={() => navigate(Paths.WRITE_POST)}
            >
              Write
            </div>
          </div>
          {!!username ? (
            <div className="loggedInBtns">
              <div
                className="primaryButton"
                onClick={() => navigate("/posts/my-posts")}
              >
                {username}
              </div>
              <div className="primaryButton" onClick={() => navigate(0)}>
                Logout
              </div>
            </div>
          ) : (
            <div
              className="primaryButton loginBtn"
              onClick={() => navigate(Paths.LOGIN)}
            >
              Log in
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
