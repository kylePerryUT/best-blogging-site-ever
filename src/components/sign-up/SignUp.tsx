import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../models/enums/paths";
import "./SignUp.css";
import axios from "../../api/axios";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import { FaInfoCircle } from "react-icons/fa";

const SignUpForm: FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState<boolean | null>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState<boolean | null>(null);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState<boolean | null>(null);

  const [passwordMatch, setPasswordMatch] = useState("");
  const [validPasswordMatch, setValidPasswordMatch] = useState<boolean | null>(
    null
  );

  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const PASSWORD_REGEX = /^.{6,}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    if (username.length > 0 && username.trim().length === 0) {
      setValidUsername(false);
      return;
    }
    setValidUsername(true);
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidPasswordMatch(password === passwordMatch);
  }, [password, passwordMatch]);

  useEffect(() => {
    setErrMessage(null);
  }, [email, password, passwordMatch]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(
        "/users",
        JSON.stringify({
          user: {
            display_name: username,
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
        navigate(Paths.MY_POSTS);
      })
      .catch((error) => console.error(error));

    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordMatch("");
  };

  return (
    <div className="SignUp">
      <form className="form" onSubmit={handleSignUp}>
        <div>
          <label htmlFor="username">
            Username:
            {username.length > 0 && validUsername ? <FcCheckmark /> : null}
            {username.length > 0 && !validUsername ? <FcCancel /> : null}
          </label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          {username.length > 0 && !validUsername ? (
            <span className="inputInfo">
              <FaInfoCircle /> This field can not be left blank.
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">
            Email:
            {email.length > 0 && validEmail ? <FcCheckmark /> : null}
            {email.length > 0 && !validEmail ? <FcCancel /> : null}
          </label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {email.length > 0 && !validEmail ? (
            <span className="inputInfo">
              <FaInfoCircle /> Please enter a valid email.
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">
            Password:
            {password.length > 0 && validPassword ? <FcCheckmark /> : null}
            {password.length > 0 && !validPassword ? <FcCancel /> : null}
          </label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {password.length > 0 && !validPassword ? (
            <span className="inputInfo">
              <FaInfoCircle /> Password must be atleast 6 characters.
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor="passwordMatch">
            Confirm password:
            {passwordMatch.length > 0 && validPasswordMatch ? (
              <FcCheckmark />
            ) : null}
            {passwordMatch.length > 0 && !validPasswordMatch ? (
              <FcCancel />
            ) : null}
          </label>
          <input
            type="password"
            id="passwordMatch"
            autoComplete="off"
            value={passwordMatch}
            required
            onChange={(e) => setPasswordMatch(e.target.value)}
          />
          {passwordMatch.length > 0 && !validPasswordMatch ? (
            <span className="inputInfo">
              <FaInfoCircle /> Passwords must match.
            </span>
          ) : null}
        </div>
        <button
          className="primaryButton signUpBtn"
          type="submit"
          disabled={
            !validUsername ||
            !validEmail ||
            !validPassword ||
            !validPasswordMatch
          }
        >
          Sign Up
        </button>
      </form>

      <p className="loginText">
        Already have an account?{" "}
        <span className="textBtn" onClick={() => navigate(Paths.LOGIN)}>
          Log in
        </span>
      </p>
    </div>
  );
};

export default SignUpForm;
