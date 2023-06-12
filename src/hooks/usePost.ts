import { useState } from "react";
import { useAxiosPrivateWithAuth } from "./useAxiosPrivate";

const usePost = (postId: number) => {
  const [updatingPost, setUpdatingPost] = useState<boolean>(false);
  const [deletingPost, setDeletingPost] = useState<boolean>(false);

  const axiosWithAuth = useAxiosPrivateWithAuth();

  const deletePost = async (): Promise<boolean> => {
    setDeletingPost(true);
    return await axiosWithAuth
      .delete(`/posts/${postId}`)
      .then((response) => {
        console.log("Successfully deleted post: ", response);
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
        console.log("Successfully updated post", response);
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
