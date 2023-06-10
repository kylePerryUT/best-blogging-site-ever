import React, { FC, useEffect, useMemo, useState } from "react";
import "./Posts.css";
import { Post } from "../../models/interfaces/post";
import PostOverview from "../post-overview/PostOverview";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import usePosts from "../../hooks/usePosts";

interface PostsProps {
  filter?: (post: Post) => boolean;
}

interface PostsPayloadMetaInfo {
  current_page: number;
  per_page: number;
  total_entries: number;
}

const Posts: FC<PostsProps> = ({ filter }) => {
  const [postsPayloadMetaInfo, setPostsPayloadMetaInfo] =
    useState<PostsPayloadMetaInfo | null>();
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  const axiosPrivate = useAxiosPrivate();
  const postsState = usePosts();

  const postsToRender: Post[] = useMemo(() => {
    const postsMap = postsState?.posts;
    let posts = !!postsMap ? Array.from(postsMap.values()) : [];
    if (!!filter) posts = posts.filter(filter);
    return posts;
  }, [postsState, filter]);

  const getNextPageNumber = (currentPageNumber: number | undefined) =>
    currentPageNumber === undefined ? 1 : currentPageNumber + 1;

  const fetchPosts = async () => {
    // Don't make a call to load more posts if were already loading some
    if (!isLoadingPosts) {
      setIsLoadingPosts(true);
      await axiosPrivate
        .get("/posts", {
          params: {
            page: getNextPageNumber(postsPayloadMetaInfo?.current_page),
          },
        })
        .then((response) => {
          if (!!postsState) {
            const postsMap = new Map<number, Post>(postsState.posts);
            response.data.posts.forEach((post: Post) =>
              postsMap.set(post.id, post)
            );
            postsState.setPosts(postsMap);
            setPostsPayloadMetaInfo({ ...response.data.meta });
          }
          setIsLoadingPosts(false);
          // TODO: Handle this error state
        })
        .catch((error) => {
          setIsLoadingPosts(false);
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (postsState === undefined || postsState.posts.size === 0) {
      fetchPosts();
    }
  }, []);

  const renderPosts = () =>
    postsToRender.map((post) => <PostOverview key={post.id} post={post} />);

  const isMorePosts = () => {
    if (!postsPayloadMetaInfo) return true;
    if (!isLoadingPosts && !!postsState) {
      const isMorePosts =
        postsState.posts.size < postsPayloadMetaInfo.total_entries;
      return isMorePosts;
    }
    return true;
  };

  return (
    <div className="Posts">
      <div className="postsAndLoading">
        <div className="scrollContainer">{renderPosts()}</div>
        {isLoadingPosts ? <h4>...Loading Posts</h4> : null}
      </div>
      {isMorePosts() ? (
        <button
          className="loadingButton"
          onClick={fetchPosts}
          disabled={isLoadingPosts}
        >
          Load more posts
        </button>
      ) : null}
    </div>
  );
};

export default Posts;
