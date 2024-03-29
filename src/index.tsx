import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/app/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/error-page/ErrorPage";
import Post from "./components/post/Post";
import WritePost from "./components/write-post/WritePost";
import Login from "./components/login/Login";
import SignUp from "./components/sign-up/SignUp";
import Paths from "./models/enums/paths";
import RequireAuth from "./components/require-auth/RequireAuth";
import MyPosts from "./components/my-posts/MyPosts";
import DiscoverPosts from "./components/discover-posts/DiscoverPosts";
import { AppContextProvider } from "./context/app-context";

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
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </React.StrictMode>
);
