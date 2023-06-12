import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import "./Posts.css";
import { Post } from "../../models/interfaces/post";
import PostOverview from "../post-overview/PostOverview";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import usePosts from "../../hooks/usePosts";
import { PayloadMetaInfo } from "../../models/interfaces/payload-meta-info";
import { ColorRing } from "react-loader-spinner";

interface PostsProps {
  filter?: (post: Post) => boolean;
}

const Posts: FC<PostsProps> = ({ filter }) => {
  const PAGE_SIZE = 30;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const expectedPostsCount = PAGE_SIZE * pageNumber;
  const [postsPayloadMetaInfo, setPostsPayloadMetaInfo] =
    useState<PayloadMetaInfo | null>();
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
  }, [isFetchInProgress]);

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
      <div className="postsContainer">
        <div className="scrollContainer verticalScroll">{renderPosts()}</div>
      </div>
      <div className="loading">
        {isMorePosts() ? (
          <button
            className="loadingButton primaryButton"
            onClick={handleLoadPosts}
            disabled={isFetchInProgress}
          >
            {isFetchInProgress || needToLoadMorePosts ? (
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
