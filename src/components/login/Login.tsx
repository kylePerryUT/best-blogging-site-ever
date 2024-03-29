import React, { FC, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Paths from "../../models/enums/paths";
import useAuth from "../../hooks/useAuth";
import { useAxiosPrivateWithAuth } from "../../hooks/useAxiosPrivate";
import useUser from "../../hooks/useUser";

const Login: FC = () => {
  const authContext = useAuth();
  const userContext = useUser();
  const navigate = useNavigate();
  const axiosPrivateWithAuth = useAxiosPrivateWithAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: any) => {
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
      .then((response: any) => {
        const accessToken: string = response.headers.authorization;
        authContext?.setAuth({ token: accessToken });
        userContext?.setUser({
          id: response.data.id,
          display_name: response.data.display_name,
        });
        navigate("/posts/my-posts", { replace: true });
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
          <button type="submit" className="primaryButton loginButton">
            Log In
          </button>
          <div className="signupText">
            Don't have an account?
            <span className="textBtn" onClick={() => navigate(Paths.SIGN_UP)}>
              Sign up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
