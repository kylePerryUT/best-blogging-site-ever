import React, { FC, useState } from "react";
import "./Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import Paths from "../../models/enums/paths";
// import { axiosPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useAxiosPrivateWithAuth } from "../../hooks/useAxiosPrivate";

const Login: FC = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivateWithAuth = useAxiosPrivateWithAuth();
  const from = location.state?.from?.pathname ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: any) => {
    console.log(typeof event);
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axiosPrivateWithAuth
      .post(
        "/users/sign_in",
        JSON.stringify({
          user: {
            email: email,
            password: password,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(JSON.stringify(response));
        const accessToken: string = response.headers.authorization;
        const username: string = response.data.display_name;
        const userId: number = response.data.id;
        authContext?.setAuth({ id: userId, username, accessToken });
        navigate(from, { replace: true });
      })
      .catch((error) => console.error(error));
    // Reset form fields
    setEmail("");
    setPassword("");
  };

  return (
    <div className="Login">
      <div className="loginModal">
        <form className="loginForm" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              required
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">Log In</button>
          <div>
            <p>
              Don't have an account?
              <span className="textBtn" onClick={() => navigate(Paths.SIGN_UP)}>
                Sign up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
