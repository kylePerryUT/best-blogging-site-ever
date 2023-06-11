import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
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
  const PAGE_SIZE = 30;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const expectedPostsCount = PAGE_SIZE * pageNumber;
  const [postsPayloadMetaInfo, setPostsPayloadMetaInfo] =
    useState<PostsPayloadMetaInfo | null>();
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false);

  const axiosPrivate = useAxiosPrivate();
  const postsState = usePosts();

  const getPostsToRender = useCallback(
    (postsMap: Map<number, Post>): Post[] => {
      let posts = !!postsMap ? Array.from(postsMap.values()) : [];
      if (!!filter) posts = posts.filter(filter);
      return posts;
    },
    [filter]
  );

  const getNextPageNumber = (currentPageNumber: number | undefined) =>
    currentPageNumber === undefined ? 1 : currentPageNumber + 1;

  const isMorePosts = useCallback(() => {
    if (!postsPayloadMetaInfo) return true;
    if (!!postsState) {
      const isMorePosts =
        postsState.posts.size < postsPayloadMetaInfo.total_entries;
      return isMorePosts;
    }
    return true;
  }, [postsPayloadMetaInfo, postsState]);

  const fetchPosts = useCallback(async () => {
    // Don't make a call to load more posts if were already loading some
    if (!isFetchInProgress) {
      setIsFetchInProgress(true);
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
        })
        .catch((error) => {
          console.error(error);
        });
      setIsFetchInProgress(false);
    }
  }, [axiosPrivate, isFetchInProgress, postsPayloadMetaInfo, postsState]);

  const needToLoadMorePosts = useMemo(
    () =>
      !!postsState &&
      getPostsToRender(postsState.posts).length < expectedPostsCount &&
      isMorePosts(),
    [postsState, expectedPostsCount, isMorePosts, getPostsToRender]
  );

  useEffect(() => {
    if (!isFetchInProgress) {
      if (postsState === undefined || postsState.posts.size === 0) {
        fetchPosts();
        return;
      }

      if (needToLoadMorePosts) {
        fetchPosts();
      }
    }
  }, [
    postsState,
    expectedPostsCount,
    isFetchInProgress,
    fetchPosts,
    needToLoadMorePosts,
  ]);

  const renderPosts = () =>
    !!postsState &&
    getPostsToRender(postsState.posts).map((post) => (
      <PostOverview key={post.id} post={post} />
    ));

  const handleLoadPosts = () => {
    setPageNumber(pageNumber + 1);
    fetchPosts();
  };

  return (
    <div className="Posts">
      <div className="postsAndLoading">
        <div className="scrollContainer">{renderPosts()}</div>
        {needToLoadMorePosts ? (
          <h4 className={"flexColCenterHorizontally"}>...Loading Posts</h4>
        ) : null}
      </div>
      {isMorePosts() ? (
        <button
          className="loadingButton"
          onClick={handleLoadPosts}
          disabled={isFetchInProgress}
        >
          Load more posts
        </button>
      ) : null}
    </div>
  );
};

export default Posts;
