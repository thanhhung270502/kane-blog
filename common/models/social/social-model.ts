// ─── Enums ───────────────────────────────────────────────────────────────────

export enum EPostVisibility {
  PUBLIC = "public",
  FRIENDS = "friends",
}

export enum EFriendshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  BLOCKED = "blocked",
}

export enum EReactionType {
  LIKE = "like",
}

export enum EAttachmentKind {
  IMAGE = "image",
  VIDEO = "video",
}

// ─── DB Row Types ─────────────────────────────────────────────────────────────

export interface UserProfileRow {
  id: string;
  user_id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostRow {
  id: string;
  author_id: string;
  body: string | null;
  visibility: string;
  shared_post_id: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostAttachmentRow {
  id: string;
  post_id: string;
  url: string;
  s3_key: string | null;
  kind: string;
  sort_order: number;
  created_at: string;
}

export interface FriendshipRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PostReactionRow {
  id: string;
  post_id: string;
  user_id: string;
  type: string;
  created_at: string;
}

export interface PostCommentRow {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  body: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostShareRow {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// ─── API-facing Object Types ──────────────────────────────────────────────────

export interface UserProfileObject {
  id: string;
  userId: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  name: string;
  createdAt: string;
}

export interface PostAttachmentObject {
  id: string;
  postId: string;
  url: string;
  kind: EAttachmentKind;
  sortOrder: number;
}

export interface PostAuthorObject {
  id: string;
  name: string;
  avatarUrl: string | null;
  username: string | null;
}

export interface PostObject {
  id: string;
  author: PostAuthorObject;
  body: string | null;
  visibility: EPostVisibility;
  attachments: PostAttachmentObject[];
  sharedPost: PostObject | null;
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
  viewerHasLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostCommentObject {
  id: string;
  postId: string;
  author: PostAuthorObject;
  body: string;
  parentId: string | null;
  createdAt: string;
}

export interface FriendshipObject {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: EFriendshipStatus;
  requester: PostAuthorObject;
  createdAt: string;
}

// ─── Requests & Responses ──────────────────────────────────────────────────────

/** Create post */
export interface CreatePostRequest {
  body?: string;
  visibility?: EPostVisibility;
  sharedPostId?: string | null;
  attachments?: Array<{ url: string; kind?: EAttachmentKind; sortOrder?: number }>;
}

export interface CreatePostResponse {
  post: PostObject;
}

/** Feed */
export interface GetFeedRequest {
  cursor?: string | null;
  limit?: number;
}

export interface GetFeedResponse {
  posts: PostObject[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** Reactions */
export interface ToggleReactionRequest {
  type?: EReactionType;
}

export interface ToggleReactionResponse {
  liked: boolean;
  reactionsCount: number;
}

/** Comments */
export interface CreateCommentRequest {
  body: string;
  parentId?: string | null;
}

export interface CreateCommentResponse {
  comment: PostCommentObject;
}

export interface GetCommentsRequest {
  cursor?: string | null;
  limit?: number;
}

export interface GetCommentsResponse {
  comments: PostCommentObject[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** Friendships */
export interface SendFriendRequestRequest {
  addresseeId: string;
}

export interface SendFriendRequestResponse {
  friendship: FriendshipObject;
}

export interface RespondFriendRequestRequest {
  status: EFriendshipStatus.ACCEPTED | EFriendshipStatus.REJECTED;
}

export interface RespondFriendRequestResponse {
  friendship: FriendshipObject;
}

export interface GetPendingFriendRequestsResponse {
  friendships: FriendshipObject[];
}

export interface GetFriendsResponse {
  friends: PostAuthorObject[];
}

/** Profile */
export interface GetProfileResponse {
  profile: UserProfileObject;
  friendshipStatus: EFriendshipStatus | null;
}

export interface UpsertProfileRequest {
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
}

export interface UpsertProfileResponse {
  profile: UserProfileObject;
}

/** User posts */
export interface GetUserPostsRequest {
  cursor?: string | null;
  limit?: number;
}

export interface GetUserPostsResponse {
  posts: PostObject[];
  nextCursor: string | null;
  hasMore: boolean;
}
