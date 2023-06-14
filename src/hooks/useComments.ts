import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../context/app-context";
import { axiosPrivate } from "../api/axios";
import { PayloadMetaInfo } from "../models/interfaces/payload-meta-info";
import { Comment } from "../models/interfaces/comment";
import { useAxiosPrivateWithAuth } from "./useAxiosPrivate";
import { useNavigate } from "react-router-dom";

export const useComments = (postId: number) => {
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false);
  const [commentsPayloadMetaInfo, setCommentsPayloadMetaInfo] =
    useState<PayloadMetaInfo | null>();

  const navigate = useNavigate();
  const axiosWithAuth = useAxiosPrivateWithAuth();
  const commentsState = useContext(AppContext)?.appState.commentsState;

  const comments: Comment[] = useMemo(() => {
    // get the comments for this post
    return Array.from(commentsState?.comments.get(postId)?.values() ?? []);
  }, [commentsState, postId]);

  const isMoreComments = useMemo(() => {
    if (
      commentsPayloadMetaInfo === undefined ||
      commentsPayloadMetaInfo === null ||
      commentsPayloadMetaInfo.total_entries === null
    ) {
      return true;
    }

    return comments.length < commentsPayloadMetaInfo.total_entries;
  }, [commentsPayloadMetaInfo, comments]);

  const getNextPageNumber = (currentPageNumber: number | undefined | null) =>
    currentPageNumber === undefined || currentPageNumber === null
      ? 1
      : currentPageNumber + 1;

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
  }, [commentsPayloadMetaInfo, commentsState]);

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
      .then((response) => {
        // update the local comments state to be able to see
        //  the comment without refreshing the app
        if (!!commentsState) {
          const newComment: Comment = response.data.comment;
          const postsUpdatedComments =
            new Map(commentsState.comments).get(postId) ??
            new Map<number, Comment>();
          postsUpdatedComments.set(newComment.id, newComment);
          const updatedCommentsMap = new Map(commentsState.comments);
          updatedCommentsMap.set(postId, postsUpdatedComments);
          commentsState.setComments(updatedCommentsMap);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return {
    loading: isFetchInProgress,
    commentsState,
    handlePostComment,
    fetchNextCommentPage,
    comments,
    isMoreComments,
  };
};
