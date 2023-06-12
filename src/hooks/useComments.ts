import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../context/app-context";
import { axiosPrivate } from "../api/axios";
import { PayloadMetaInfo } from "../models/interfaces/payload-meta-info";
import { Comment } from "../models/interfaces/comment";
import { useAxiosPrivateWithAuth } from "./useAxiosPrivate";

export const useComments = (postId: number) => {
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false);
  const [commentsPayloadMetaInfo, setCommentsPayloadMetaInfo] =
    useState<PayloadMetaInfo | null>();

  const axiosWithAuth = useAxiosPrivateWithAuth();
  const commentsState = useContext(AppContext)?.appState.commentsState;

  const comments: Comment[] = useMemo(() => {
    // get the comments for this post
    return Array.from(commentsState?.comments.get(postId)?.values() ?? []);
    // return Array.from(commentsState?.comments.values() ?? []).filter(comment => comment.);
  }, [commentsState, postId]);

  const isMoreComments = useMemo(() => {
    if (!commentsPayloadMetaInfo) return true;
    if (!!comments) {
      const isMorePosts =
        comments.length < commentsPayloadMetaInfo.total_entries;
      return isMorePosts;
    }
    return true;
  }, [commentsPayloadMetaInfo, comments]);

  const getNextPageNumber = (currentPageNumber: number | undefined) =>
    currentPageNumber === undefined ? 1 : currentPageNumber + 1;

  const fetchNextCommentPage = useCallback(async () => {
    // Don't make a call to load more posts if were already loading some
    if (!isFetchInProgress) {
      setIsFetchInProgress(true);
      await axiosPrivate
        .get(`/posts/${postId}/comments`, {
          params: {
            page: getNextPageNumber(commentsPayloadMetaInfo?.current_page),
          },
        })
        .then((response) => {
          if (!!commentsState) {
            const commentsMap = new Map<number, Comment>(
              commentsState.comments.get(postId)
            );
            response.data.comments.forEach((comment: Comment) =>
              commentsMap.set(comment.id, comment)
            );
            const updatedCommentsMap = new Map(commentsState.comments).set(
              postId,
              commentsMap
            );
            commentsState.setComments(updatedCommentsMap);
            setCommentsPayloadMetaInfo({ ...response.data.meta });
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setIsFetchInProgress(false);
    }
  }, []);

  useEffect(() => {
    fetchNextCommentPage();
  }, []);

  const handlePostComment = useCallback(async (commentBody: string) => {
    await axiosWithAuth
      .post(
        "/comments",
        JSON.stringify({
          comment: { post_id: postId, content: commentBody },
        })
      )
      .then((response) => console.log(response.data))
      .catch((err) => console.error(err));
  }, []);

  return {
    commentsState,
    handlePostComment,
    fetchNextCommentPage,
    comments,
    isMoreComments,
  };
};
