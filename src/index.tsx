import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./components/app/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/error-page/ErrorPage";
import Post from "./components/post/Post";
import WritePost from "./components/write-post/WritePost";
import Login from "./components/login/Login";
import SignUp from "./components/sign-up/SignUp";
import Paths from "./models/enums/paths";
import RequireAuth from "./components/require-auth/RequireAuth";
import { AuthProvider } from "./context/auth-provider";
import MyPosts from "./components/my-posts/MyPosts";
import DiscoverPosts from "./components/discover-posts/DiscoverPosts";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DiscoverPosts />,
      },
      {
        path: Paths.POSTS,
        element: <DiscoverPosts />,
      },
      {
        path: Paths.POST,
        element: <Post />,
      },
      {
        path: Paths.LOGIN,
        element: <Login />,
      },
      {
        path: Paths.SIGN_UP,
        element: <SignUp />,
      },
      {
        element: <RequireAuth />,
        children: [
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
            element: <MyPosts />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
