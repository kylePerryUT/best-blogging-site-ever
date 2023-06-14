import { useState } from "react";
import { useAxiosPrivateWithAuth } from "./useAxiosPrivate";
import usePosts from "./usePosts";
import { Post } from "../models/interfaces/post";

const usePost = (postId: number) => {
  const [updatingPost, setUpdatingPost] = useState<boolean>(false);
  const [deletingPost, setDeletingPost] = useState<boolean>(false);
  const { postsState } = usePosts();

  const axiosWithAuth = useAxiosPrivateWithAuth();

  const deletePost = async (): Promise<boolean> => {
    setDeletingPost(true);
    return await axiosWithAuth
      .delete(`/posts/${postId}`)
      .then((response) => {
        // remove the post from the state so we can see it as "deleted"
        //  without having to refresh the app
        if (!!postsState) {
          const updatedPostsState = postsState.posts;
          updatedPostsState.delete(postId);
          postsState.setPosts(updatedPostsState);
        }
        setDeletingPost(false);
        return true;
      })
      .catch((error) => {
        console.error("Error delete post: ", error);
        setDeletingPost(false);
        return false;
      });
  };

  const updatePost = async (
    updatedTitle: string,
    updatedBody: string
  ): Promise<boolean> => {
    setUpdatingPost(true);
    return await axiosWithAuth
      .patch(
        `/posts/${postId}`,
        JSON.stringify({
          post: {
            title: updatedTitle,
            body: updatedBody,
          },
        })
      )
      .then((response) => {
        // update the post in the local state so we can see the updated
        //  version without having to refresh the app
        if (!!postsState) {
          const updatedPost: Post = response.data.post;
          const updatedPostsState = postsState.posts;
          updatedPostsState.set(postId, updatedPost);
          postsState.setPosts(updatedPostsState);
        }
        setUpdatingPost(false);

        return true;
      })
      .catch((error) => {
        console.error("Error updating post: ", error);
        setUpdatingPost(false);
        return false;
      });
  };

  return {
    updatePost,
    updatingPost,
    deletePost,
    deletingPost,
  };
};

export default usePost;
