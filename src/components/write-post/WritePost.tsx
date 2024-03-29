import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import "./WritePost.css";
import { NewPost } from "../../models/interfaces/new-post";
import { useAxiosPrivateWithAuth } from "../../hooks/useAxiosPrivate";

const DEFAULT_POST_STATE = {
  title: "",
  body: "",
};

const WritePost: FC = () => {
  const [post, setPost] = useState<NewPost>(DEFAULT_POST_STATE);
  const axiosWithAuth = useAxiosPrivateWithAuth();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: event.target.value });
  };

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, body: event.target.value });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    axiosWithAuth.post(
      "/posts",
      JSON.stringify({
        post: {
          title: post.title,
          body: post.body,
        },
      })
    );
    // Reset the form fields
    setPost(DEFAULT_POST_STATE);
  };
  return (
    <div className="WritePost">
      <form onSubmit={handleSubmit} className="writePostForm">
        <div className="input">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="input">
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            name="body"
            value={post.body}
            onChange={handleBodyChange}
            rows={4}
            cols={50}
            required
          ></textarea>
        </div>
        <input
          type="submit"
          value="Post"
          className="primaryButton postButton"
        />
      </form>
    </div>
  );
};

export default WritePost;
