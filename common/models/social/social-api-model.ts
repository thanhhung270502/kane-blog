import { APIBaseRoutes } from "../../constants";
import type { APIDefinition } from "../api-route-model";
import { APIMethod } from "../api-route-model";

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
} from "./social-model";

/** Feed */
export const API_GET_FEED: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/feed",
  responseBody: {} as GetFeedResponse,
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/feed`,
};

/** Posts */
export const API_CREATE_POST: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/posts",
  requestBody: {} as CreatePostRequest,
  responseBody: {} as CreatePostResponse,
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/posts`,
};

export const API_DELETE_POST: APIDefinition<{ id: string }> = {
  method: APIMethod.DELETE,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/posts/:id",
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/posts/${id}`,
  responseBody: {},
};

/** Reactions */
export const API_TOGGLE_REACTION: APIDefinition<{ id: string }> = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/posts/:id/reactions",
  requestBody: {} as ToggleReactionRequest,
  responseBody: {} as ToggleReactionResponse,
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/posts/${id}/reactions`,
};

/** Comments */
export const API_GET_COMMENTS: APIDefinition<{ id: string }> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/posts/:id/comments",
  responseBody: {} as GetCommentsResponse,
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/posts/${id}/comments`,
};

export const API_CREATE_COMMENT: APIDefinition<{ id: string }> = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/posts/:id/comments",
  requestBody: {} as CreateCommentRequest,
  responseBody: {} as CreateCommentResponse,
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/posts/${id}/comments`,
};

/** Friendships */
export const API_SEND_FRIEND_REQUEST: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/friendships",
  requestBody: {} as SendFriendRequestRequest,
  responseBody: {} as SendFriendRequestResponse,
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/friendships`,
};

export const API_GET_PENDING_FRIEND_REQUESTS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/friendships/pending",
  responseBody: {} as GetPendingFriendRequestsResponse,
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/friendships/pending`,
};

export const API_GET_FRIENDS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/friendships/friends",
  responseBody: {} as GetFriendsResponse,
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/friendships/friends`,
};

export const API_RESPOND_FRIEND_REQUEST: APIDefinition<{ id: string }> = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/friendships/:id",
  requestBody: {} as RespondFriendRequestRequest,
  responseBody: {} as RespondFriendRequestResponse,
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/friendships/${id}`,
};

export const API_REMOVE_FRIEND: APIDefinition<{ id: string }> = {
  method: APIMethod.DELETE,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/friendships/:id",
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/friendships/${id}`,
  responseBody: {},
};

/** Profile */
export const API_GET_PROFILE: APIDefinition<{ id: string }> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/users/:id/profile",
  responseBody: {} as GetProfileResponse,
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/users/${id}/profile`,
};

export const API_UPSERT_PROFILE: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/profile",
  requestBody: {} as UpsertProfileRequest,
  responseBody: {} as UpsertProfileResponse,
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/profile`,
};

export const API_GET_USER_POSTS: APIDefinition<{ id: string }> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/users/:id/posts",
  responseBody: {} as GetUserPostsResponse,
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/users/${id}/posts`,
};

/** Notifications */
export const API_GET_NOTIFICATIONS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/notifications",
  responseBody: {} as GetNotificationsResponse,
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/notifications`,
};

export const API_MARK_NOTIFICATION_READ: APIDefinition<{ id: string }> = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/notifications/:id",
  responseBody: {} as MarkNotificationReadResponse,
  buildUrlPath: ({ id }) => `${APIBaseRoutes.SOCIAL}/notifications/${id}`,
};

export const API_MARK_ALL_NOTIFICATIONS_READ: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.SOCIAL,
  subUrl: "/notifications/read-all",
  responseBody: {},
  buildUrlPath: () => `${APIBaseRoutes.SOCIAL}/notifications/read-all`,
};
