import type {
  CreateCommentRequest,
  CreateCommentResponse,
  CreatePostRequest,
  CreatePostResponse,
  GetCommentsResponse,
  GetFeedResponse,
  GetFriendsResponse,
  GetPendingFriendRequestsResponse,
  GetProfileResponse,
  GetUserPostsResponse,
  RespondFriendRequestRequest,
  RespondFriendRequestResponse,
  SendFriendRequestRequest,
  SendFriendRequestResponse,
  ToggleReactionRequest,
  ToggleReactionResponse,
  UpsertProfileRequest,
  UpsertProfileResponse,
} from "@common";
import {
  API_CREATE_COMMENT,
  API_CREATE_POST,
  API_GET_COMMENTS,
  API_GET_FEED,
  API_GET_FRIENDS,
  API_GET_PENDING_FRIEND_REQUESTS,
  API_GET_PROFILE,
  API_GET_USER_POSTS,
  API_REMOVE_FRIEND,
  API_RESPOND_FRIEND_REQUEST,
  API_SEND_FRIEND_REQUEST,
  API_TOGGLE_REACTION,
  API_UPSERT_PROFILE,
} from "@common";

import { deleteRequest, getRequest, patchRequest, postRequest } from "@/libs/api-client";

export const getFeed = async (cursor?: string | null, limit = 20): Promise<GetFeedResponse> => {
  return await getRequest({
    path: API_GET_FEED.buildUrlPath({}),
    params: { ...(cursor ? { cursor } : {}), limit },
  });
};

export const createPost = async (data: CreatePostRequest): Promise<CreatePostResponse> => {
  const response = await postRequest({ path: API_CREATE_POST.buildUrlPath({}), data });
  return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await deleteRequest({ path: `/api/social/posts/${postId}` });
};

export const toggleReaction = async (
  postId: string,
  data: ToggleReactionRequest = {}
): Promise<ToggleReactionResponse> => {
  const response = await postRequest({
    path: API_TOGGLE_REACTION.buildUrlPath(postId),
    data,
  });
  return response.data;
};

export const getComments = async (
  postId: string,
  cursor?: string | null,
  limit = 20
): Promise<GetCommentsResponse> => {
  return await getRequest({
    path: API_GET_COMMENTS.buildUrlPath(postId),
    params: { ...(cursor ? { cursor } : {}), limit },
  });
};

export const createComment = async (
  postId: string,
  data: CreateCommentRequest
): Promise<CreateCommentResponse> => {
  const response = await postRequest({
    path: API_CREATE_COMMENT.buildUrlPath(postId),
    data,
  });
  return response.data;
};

export const sharePost = async (postId: string, body?: string): Promise<CreatePostResponse> => {
  const response = await postRequest({
    path: `/api/social/posts/${postId}/share`,
    data: { body },
  });
  return response.data;
};

export const sendFriendRequest = async (
  data: SendFriendRequestRequest
): Promise<SendFriendRequestResponse> => {
  const response = await postRequest({ path: API_SEND_FRIEND_REQUEST.buildUrlPath({}), data });
  return response.data;
};

export const respondFriendRequest = async (
  friendshipId: string,
  data: RespondFriendRequestRequest
): Promise<RespondFriendRequestResponse> => {
  const response = await patchRequest({
    path: API_RESPOND_FRIEND_REQUEST.buildUrlPath(friendshipId),
    data,
  });
  return response.data;
};

export const removeFriend = async (friendshipId: string): Promise<void> => {
  await deleteRequest({ path: API_REMOVE_FRIEND.buildUrlPath(friendshipId) });
};

export const getPendingRequests = async (): Promise<GetPendingFriendRequestsResponse> => {
  return await getRequest({ path: API_GET_PENDING_FRIEND_REQUESTS.buildUrlPath({}) });
};

export const getFriends = async (): Promise<GetFriendsResponse> => {
  return await getRequest({ path: API_GET_FRIENDS.buildUrlPath({}) });
};

export const getUserProfile = async (userId: string): Promise<GetProfileResponse> => {
  return await getRequest({ path: API_GET_PROFILE.buildUrlPath(userId) });
};

export const getMyProfile = async (): Promise<GetProfileResponse> => {
  return await getRequest({ path: API_UPSERT_PROFILE.buildUrlPath({}) });
};

export const upsertProfile = async (data: UpsertProfileRequest): Promise<UpsertProfileResponse> => {
  const response = await postRequest({ path: API_UPSERT_PROFILE.buildUrlPath({}), data });
  return response.data;
};

export const getUserPosts = async (
  userId: string,
  cursor?: string | null,
  limit = 20
): Promise<GetUserPostsResponse> => {
  return await getRequest({
    path: API_GET_USER_POSTS.buildUrlPath(userId),
    params: { ...(cursor ? { cursor } : {}), limit },
  });
};
