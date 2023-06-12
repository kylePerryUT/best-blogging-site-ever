import React, { createContext, useState, FC, ReactNode } from "react";
import { User } from "../models/interfaces/user";
import { Authentication } from "../models/interfaces/authentication";
import { Post } from "../models/interfaces/post";
import { Comment } from "../models/interfaces/comment";

interface AuthState {
  auth: Authentication;
  setAuth: React.Dispatch<React.SetStateAction<Authentication>>;
}

const AUTH_DEFAULT_STATE: Authentication = {
  token: null,
};

interface UserState {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const USER_DEFAULT_STATE: User = {
  id: null,
  display_name: null,
};

interface PostsState {
  posts: Map<number, Post>;
  setPosts: React.Dispatch<React.SetStateAction<Map<number, Post>>>;
}

const POSTS_DEFAULT_STATE: Map<number, Post> = new Map<number, Post>();

interface CommentsState {
  comments: Map<number, Map<number, Comment>>;
  setComments: React.Dispatch<
    React.SetStateAction<Map<number, Map<number, Comment>>>
  >;
}

const COMMENTS_DEFAULT_STATE: Map<number, Map<number, Comment>> = new Map<
  number,
  Map<number, Comment>
>();

interface AppState {
  authState: AuthState;
  userState: UserState;
  postsState: PostsState;
  commentsState: CommentsState;
}

// TODO: update the type
const AppContext = createContext<{ appState: AppState } | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<Authentication>(AUTH_DEFAULT_STATE);
  const [user, setUser] = useState<User>(USER_DEFAULT_STATE);
  const [posts, setPosts] = useState<Map<number, Post>>(POSTS_DEFAULT_STATE);
  // map<postId, map<commentId, comment>>
  const [comments, setComments] = useState<Map<number, Map<number, Comment>>>(
    COMMENTS_DEFAULT_STATE
  );

  return (
    <AppContext.Provider
      value={{
        appState: {
          authState: { auth, setAuth },
          userState: { user, setUser },
          postsState: { posts, setPosts },
          commentsState: { comments, setComments },
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
