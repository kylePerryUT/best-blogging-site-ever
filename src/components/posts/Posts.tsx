import React, { FC, useEffect, useState } from "react";
import "./Posts.css";
import { Post } from "../../models/interfaces/post";
import PostOverview from "../post-overview/PostOverview";
import usePosts from "../../hooks/usePosts";
import { ColorRing } from "react-loader-spinner";

interface PostsProps {
  filter?: (post: Post) => boolean;
}

const Posts: FC<PostsProps> = ({ filter }) => {
  // const [page, setPage] = useState<number>(0);
  const {
    loading,
    getFilteredPosts,
    handleLoadPosts,
    isMorePosts,
    postsState,
  } = usePosts(filter);

  useEffect(() => {
    handleLoadPosts();
  }, []);

  const renderPosts = () =>
    getFilteredPosts(postsState?.posts ?? new Map()).map((post) => (
      <PostOverview key={post.id} post={post} />
    ));

  return (
    <div className="Posts">
      <div className="postsContainer">
        <div className="scrollContainer verticalScroll">{renderPosts()}</div>
      </div>
      <div className="loading">
        {isMorePosts ? (
          <button
            className="loadingButton primaryButton"
            onClick={handleLoadPosts}
            disabled={loading}
          >
            {loading ? (
              <ColorRing
                visible={true}
                height="24"
                width="24"
                ariaLabel="blocks-loading"
                colors={["#eeead9", "#eeead9", "#eeead9", "#eeead9", "#eeead9"]}
              />
            ) : (
              "Load more posts"
            )}
          </button>
        ) : (
          <div className={"flexColCenterHorizontally postsLoaded"}>
            All posts loaded
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
