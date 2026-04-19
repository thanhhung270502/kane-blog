import type {
  CreateCommentRequest,
  CreateCommentResponse,
  CreatePostRequest,
  CreatePostResponse,
  GetCommentsResponse,
  GetFeedResponse,
  GetFriendsResponse,
  GetNotificationsResponse,
  GetPendingFriendRequestsResponse,
  GetProfileResponse,
  GetUserPostsResponse,
  MarkNotificationReadResponse,
  RespondFriendRequestRequest,
  RespondFriendRequestResponse,
  SendFriendRequestRequest,
  SendFriendRequestResponse,
  ToggleReactionRequest,
  ToggleReactionResponse,
  UpsertProfileRequest,
  UpsertProfileResponse,
} from "@common";
import { EAttachmentKind } from "@common";
import {
  API_CREATE_COMMENT,
  API_CREATE_POST,
  API_GET_COMMENTS,
  API_GET_FEED,
  API_GET_FRIENDS,
  API_GET_NOTIFICATIONS,
  API_GET_PENDING_FRIEND_REQUESTS,
  API_GET_PROFILE,
  API_GET_USER_POSTS,
  API_MARK_ALL_NOTIFICATIONS_READ,
  API_MARK_NOTIFICATION_READ,
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
    path: API_TOGGLE_REACTION.buildUrlPath({ id: postId }),
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
    path: API_GET_COMMENTS.buildUrlPath({ id: postId }),
    params: { ...(cursor ? { cursor } : {}), limit },
  });
};

export const createComment = async (
  postId: string,
  data: CreateCommentRequest
): Promise<CreateCommentResponse> => {
  const response = await postRequest({
    path: API_CREATE_COMMENT.buildUrlPath({ id: postId }),
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
    path: API_RESPOND_FRIEND_REQUEST.buildUrlPath({ id: friendshipId }),
    data,
  });
  return response.data;
};

export const removeFriend = async (friendshipId: string): Promise<void> => {
  await deleteRequest({ path: API_REMOVE_FRIEND.buildUrlPath({ id: friendshipId }) });
};

export const getPendingRequests = async (): Promise<GetPendingFriendRequestsResponse> => {
  return await getRequest({ path: API_GET_PENDING_FRIEND_REQUESTS.buildUrlPath({}) });
};

export const getFriends = async (): Promise<GetFriendsResponse> => {
  return await getRequest({ path: API_GET_FRIENDS.buildUrlPath({}) });
};

export const getUserProfile = async (userId: string): Promise<GetProfileResponse> => {
  return await getRequest({ path: API_GET_PROFILE.buildUrlPath({ id: userId }) });
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
    path: API_GET_USER_POSTS.buildUrlPath({ id: userId }),
    params: { ...(cursor ? { cursor } : {}), limit },
  });
};

/**
 * Upload a profile image (avatar or cover) to S3 and update the user profile.
 * Flow: get presigned PUT URL → upload file to S3 → upsert profile with the image path.
 */
export const uploadProfileImage = async (
  kind: "avatar" | "cover",
  file: File
): Promise<UpsertProfileResponse> => {
  const ext = file.type.replace("image/", "");

  // 1. Get presigned upload URL from our API
  const { uploadUrl, imagePath } = await (async () => {
    const res = await postRequest({
      path: "/api/social/upload-url",
      data: { kind, imageType: ext },
    });
    return res.data as { uploadUrl: string; imagePath: string };
  })();

  // 2. PUT the file directly to S3
  const s3Response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!s3Response.ok) {
    throw new Error("Failed to upload image to storage");
  }

  // 3. Persist the path on the profile
  const profile = await upsertProfile(
    kind === "avatar" ? { avatarPath: imagePath } : { coverPath: imagePath }
  );
  return profile;
};

/**
 * Upload a single image or video file as a post attachment.
 * Flow: get presigned PUT URL → upload file to S3 → return attachment descriptor.
 * Uses a pre-generated tempPostId so uploads can happen before post creation.
 */
export const uploadPostMediaFile = async (
  file: File,
  tempPostId: string,
  sortOrder: number
): Promise<NonNullable<CreatePostRequest["attachments"]>[number]> => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? file.type.split("/")[1] ?? "jpg";
  const kind = file.type.startsWith("video/") ? EAttachmentKind.VIDEO : EAttachmentKind.IMAGE;

  const res = await postRequest({
    path: "/api/social/upload-url",
    data: { kind: "post-attachment", postId: tempPostId, imageType: ext },
  });
  const { uploadUrl, imagePath } = res.data as { uploadUrl: string; imagePath: string };

  const s3Response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!s3Response.ok) throw new Error("Failed to upload media to storage");

  return { url: imagePath, kind, sortOrder };
};

// ─── Notifications ─────────────────────────────────────────────────────────────

export const getNotifications = async (): Promise<GetNotificationsResponse> => {
  return await getRequest({ path: API_GET_NOTIFICATIONS.buildUrlPath({}) });
};

export const markNotificationRead = async (id: string): Promise<MarkNotificationReadResponse> => {
  const response = await patchRequest({ path: API_MARK_NOTIFICATION_READ.buildUrlPath({ id }), data: {} });
  return response.data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await postRequest({ path: API_MARK_ALL_NOTIFICATIONS_READ.buildUrlPath({}), data: {} });
};
