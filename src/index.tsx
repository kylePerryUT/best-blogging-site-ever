import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./components/app/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/error-page/ErrorPage";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import WritePost from "./components/write-post/WritePost";
import Login from "./components/login/Login";
import SignUp from "./components/sign-up/SignUp";
import Paths from "./models/enums/paths";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: Paths.POSTS,
        element: <Posts />,
      },
      {
        path: Paths.POST,
        element: <Post />,
      },
      {
        path: Paths.WRITE_POST,
        element: <WritePost />,
      },
      {
        path: Paths.EDIT_POST,
        element: <WritePost />,
      },
      {
        path: Paths.MY_POSTS,
        element: <Posts />,
      },
      {
        path: Paths.LOGIN,
        element: <Login />,
      },
      {
        path: Paths.SIGN_UP,
        element: <SignUp />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
