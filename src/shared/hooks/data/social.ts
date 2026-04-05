"use client";

import type {
  CreateCommentRequest,
  CreatePostRequest,
  GetFeedResponse,
  RespondFriendRequestRequest,
  SendFriendRequestRequest,
  UpsertProfileRequest,
} from "@common";
import { toast } from "sonner";

import type { MutationProps, QueryProps } from "@/shared";
import {
  asError,
  SOCIAL_KEYS,
  useMutation,
  useQuery,
  useQueryClient,
} from "@/shared";
import {
  createComment,
  createPost,
  deletePost,
  getComments,
  getFeed,
  getFriends,
  getMyProfile,
  getPendingRequests,
  getUserProfile,
  removeFriend,
  respondFriendRequest,
  sendFriendRequest,
  sharePost,
  toggleReaction,
  upsertProfile,
} from "@/shared/apis";

// ─── Feed ─────────────────────────────────────────────────────────────────────

export const useQueryFeed = (props: QueryProps<GetFeedResponse> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.feed(),
    queryFn: () => getFeed(),
    ...props,
  });
};

// ─── Post mutations ───────────────────────────────────────────────────────────

export const useCreatePostMutation = (props: MutationProps<unknown, CreatePostRequest> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      toast.success("Post created");
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.all() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

export const useDeletePostMutation = (props: MutationProps<void, string> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      toast.success("Post deleted");
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.all() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

export const useToggleReactionMutation = (
  postId: string,
  props: MutationProps<unknown, { type?: string }> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { type?: string } = {}) => toggleReaction(postId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.feed() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

export const useSharePostMutation = (props: MutationProps<unknown, { postId: string; body?: string }> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, body }: { postId: string; body?: string }) => sharePost(postId, body),
    onSuccess: async () => {
      toast.success("Post shared to your feed");
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.all() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const useQueryComments = (postId: string, props: QueryProps<unknown> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.comments(postId),
    queryFn: () => getComments(postId),
    ...props,
  });
};

export const useCreateCommentMutation = (
  postId: string,
  props: MutationProps<unknown, CreateCommentRequest> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => createComment(postId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.comments(postId) });
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.feed() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

// ─── Friendships ──────────────────────────────────────────────────────────────

export const useQueryFriends = (props: QueryProps<unknown> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.friends(),
    queryFn: getFriends,
    ...props,
  });
};

export const useQueryPendingRequests = (props: QueryProps<unknown> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.pendingRequests(),
    queryFn: getPendingRequests,
    ...props,
  });
};

export const useSendFriendRequestMutation = (
  props: MutationProps<unknown, SendFriendRequestRequest> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: async () => {
      toast.success("Friend request sent");
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.friends() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

export const useRespondFriendRequestMutation = (
  props: MutationProps<unknown, { id: string; data: RespondFriendRequestRequest }> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RespondFriendRequestRequest }) =>
      respondFriendRequest(id, data),
    onSuccess: async (_, { data }) => {
      toast.success(data.status === "accepted" ? "Friend request accepted" : "Request declined");
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.pendingRequests() });
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.friends() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

export const useRemoveFriendMutation = (props: MutationProps<void, string> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFriend,
    onSuccess: async () => {
      toast.success("Friend removed");
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.friends() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const useQueryUserProfile = (userId: string, props: QueryProps<unknown> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    ...props,
  });
};

export const useQueryMyProfile = (props: QueryProps<unknown> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.myProfile(),
    queryFn: getMyProfile,
    ...props,
  });
};

export const useUpsertProfileMutation = (
  props: MutationProps<unknown, UpsertProfileRequest> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertProfile,
    onSuccess: async () => {
      toast.success("Profile updated");
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.myProfile() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};
