import { useCallback, useContext, useMemo, useState } from "react";
import AppContext from "../context/app-context";
import { Post } from "../models/interfaces/post";
import { PayloadMetaInfo } from "../models/interfaces/payload-meta-info";
import { useAxiosPrivate } from "./useAxiosPrivate";

const usePosts = (filter?: (post: Post) => boolean) => {
  const PAGE_SIZE = 30;
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const axiosPrivate = useAxiosPrivate();
  const postsState = useContext(AppContext)?.appState.postsState;

  const getNextPageNumber = (currentPageNumber: number | undefined | null) =>
    currentPageNumber === undefined || currentPageNumber === null
      ? 1
      : currentPageNumber + 1;

  const expectedFilteredPostsCount = useCallback(
    (nextPageNumber: number) => PAGE_SIZE * nextPageNumber,
    []
  );

  // const filteredPosts = useMemo(() => {
  //   const postsMap = postsState?.posts ?? new Map();
  //   let posts = !!postsMap ? Array.from(postsMap.values()) : [];
  //   if (!!filter) posts = posts.filter(filter);
  //   return posts;
  // }, [filter, postsState]);

  const isMorePosts = useMemo(() => {
    debugger;
    if (
      postsState?.postsPayloadMetaInfo === undefined ||
      postsState?.postsPayloadMetaInfo === null ||
      postsState.postsPayloadMetaInfo.total_entries === null ||
      postsState === undefined
    ) {
      debugger;
      return true;
    }

    const morePosts =
      postsState.posts.size < postsState.postsPayloadMetaInfo.total_entries;
    debugger;
    console.log(morePosts);
    return morePosts;
  }, [postsState]);

  // const needToLoadMorePosts = useCallback(
  //   (nextPageNumber: number, filteredPosts: Post[], totalPostsCount: number) => {
  //     debugger;
  //     const shouldLoadeMore =
  //       filteredPosts.length < expectedFilteredPostsCount(nextPageNumber);
  //     debugger;
  //     return shouldLoadeMore;
  //   },
  //   [postsState, filteredPosts, isMorePosts, expectedFilteredPostsCount]
  // );

  const getUpdatedPostsMap = (
    existingPostsMap: Map<number, Post>,
    newPosts: Post[]
  ) => {
    const updatedMap = existingPostsMap;
    newPosts.forEach((post: Post) => updatedMap.set(post.id, post));
    return updatedMap;
  };

  const fetchPostsByPageNumber = useCallback(
    async (pageNumber: number) =>
      await axiosPrivate
        .get("/posts", {
          params: {
            page: pageNumber,
          },
        })
        .then((response) => {
          debugger;
          const updatedPostsMap = getUpdatedPostsMap(
            postsState?.posts ?? new Map(),
            response.data.posts
          );
          postsState?.setPosts(updatedPostsMap);
          debugger;
          postsState?.setPostsPayloadMetaInfo(response.data.meta);

          return response.data;
        })
        .catch((error) => {
          console.error(error);
          return error;
        }),
    [axiosPrivate, postsState]
  );

  const getFilteredPostsFromPostsMap = (
    unfilteredPostsMap: Map<number, Post>
  ) => {
    const posts = Array.from(unfilteredPostsMap.values());
    if (!!filter) return posts.filter(filter);
    return posts;
  };

  const handleLoadNextPostsPage = useCallback(async () => {
    const nextPageNumber = pageNumber + 1;
    setPageNumber(nextPageNumber);
    setLoading(true);
    let currentPostsMap = postsState?.posts ?? new Map();
    let nextFetchRequestPageNumber = getNextPageNumber(
      postsState?.postsPayloadMetaInfo?.current_page
    );
    let filteredPosts = getFilteredPostsFromPostsMap(currentPostsMap);
    if (!!filter) filteredPosts = filteredPosts.filter(filter);
    let postsPayloadMetaData = postsState?.postsPayloadMetaInfo;
    while (
      filteredPosts.length < expectedFilteredPostsCount(nextPageNumber) &&
      (postsPayloadMetaData === null ||
        postsPayloadMetaData === undefined ||
        postsPayloadMetaData.total_entries === null ||
        currentPostsMap.size < postsPayloadMetaData.total_entries)
    ) {
      const data = await fetchPostsByPageNumber(nextFetchRequestPageNumber);
      nextFetchRequestPageNumber = getNextPageNumber(data.meta.current_page);
      const updatedPostsMap = getUpdatedPostsMap(currentPostsMap, data.posts);
      currentPostsMap = updatedPostsMap;
      filteredPosts = getFilteredPostsFromPostsMap(updatedPostsMap);
      postsPayloadMetaData = data.meta;
    }

    setLoading(false);
  }, [
    // getFilteredPostsFromPostsMap,
    postsState,
    pageNumber,
    fetchPostsByPageNumber,
    filter,
    expectedFilteredPostsCount,
  ]);

  return {
    loading,
    pageNumber,
    postsState,
    getFilteredPosts: getFilteredPostsFromPostsMap,
    handleLoadPosts: handleLoadNextPostsPage,
    isMorePosts,
  };
};

export default usePosts;
