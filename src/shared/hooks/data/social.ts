"use client";

import type {
  CreateCommentRequest,
  CreateCommentResponse,
  CreatePostRequest,
  GetCommentsResponse,
  GetFeedResponse,
  GetProfileResponse,
  GetUserPostsResponse,
  RespondFriendRequestRequest,
  SendFriendRequestRequest,
  ToggleReactionRequest,
  ToggleReactionResponse,
  UpsertProfileRequest,
  UpsertProfileResponse,
} from "@common";
import { toast } from "sonner";

import type { MutationProps, QueryProps } from "@/shared";
import { asError, SOCIAL_KEYS, useMutation, useQuery, useQueryClient } from "@/shared";
import {
  createComment,
  createPost,
  deletePost,
  getComments,
  getFeed,
  getFriends,
  getMyProfile,
  getPendingRequests,
  getUserPosts,
  getUserProfile,
  removeFriend,
  respondFriendRequest,
  sendFriendRequest,
  sharePost,
  toggleReaction,
  uploadProfileImage,
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

type ToggleReactionMutationProps = MutationProps<
  ToggleReactionResponse,
  ToggleReactionRequest & { postId: string }
>;

export const useToggleReactionMutation = (props: ToggleReactionMutationProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, type }: ToggleReactionRequest & { postId: string }) =>
      toggleReaction(postId, { type }),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: SOCIAL_KEYS.feed() });
      const previousData = queryClient.getQueryData(SOCIAL_KEYS.feed()) as GetFeedResponse;
      queryClient.setQueryData(SOCIAL_KEYS.feed(), (old: GetFeedResponse) => {
        const posts = old.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              viewerHasLiked: !post.viewerHasLiked,
              reactionsCount: post.reactionsCount + (post.viewerHasLiked ? -1 : 1),
            };
          }
          return post;
        });
        return { ...old, posts };
      });
      return { previousData };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.feed() });
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

export const useSharePostMutation = (
  props: MutationProps<unknown, { postId: string; body?: string }> = {}
) => {
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
type QueryCommentsInput = {
  postId: string;
};
export const useQueryComments = (props: QueryProps<GetCommentsResponse, QueryCommentsInput>) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.comments(props.input.postId),
    queryFn: () => getComments(props.input.postId),
    ...props,
  });
};

type CreateCommentMutationInput = {
  postId: string;
  body: CreateCommentRequest;
};
type CreateCommentMutationProps = MutationProps<CreateCommentResponse, CreateCommentMutationInput>;
export const useCreateCommentMutation = (props: CreateCommentMutationProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, body }: CreateCommentMutationInput) => createComment(postId, body),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: SOCIAL_KEYS.comments(data.postId) });
      const previousData = queryClient.getQueryData(
        SOCIAL_KEYS.comments(data.postId)
      ) as GetCommentsResponse;
      queryClient.setQueryData(SOCIAL_KEYS.comments(data.postId), (old: GetCommentsResponse) => {
        return {
          ...old,
          comments: [
            ...old.comments,
            {
              id: crypto.randomUUID(),
              postId: data.postId,
              author: data.body.author,
              body: data.body.body,
              parentId: data.body.parentId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        };
      });
      return { previousData };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.comments(variables.postId) });
      // await queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.feed() });
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

export const useQueryUserProfile = (userId: string, props: QueryProps<GetProfileResponse> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    ...props,
  });
};

export const useQueryMyProfile = (props: QueryProps<GetProfileResponse> = {}) => {
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

export const useQueryUserPosts = (userId: string, props: QueryProps<GetUserPostsResponse> = {}) => {
  return useQuery({
    queryKey: SOCIAL_KEYS.userPosts(userId),
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
    ...props,
  });
};

// ─── Profile image uploads ─────────────────────────────────────────────────────

export const useUploadAvatarMutation = (props: MutationProps<UpsertProfileResponse, File> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadProfileImage("avatar", file),
    onSuccess: (data) => {
      toast.success("Avatar updated");
      queryClient.setQueryData(
        SOCIAL_KEYS.profile(data.profile.userId),
        (old: GetProfileResponse) => {
          return {
            ...old,
            profile: {
              ...old.profile,
              avatarUrl: data.profile.avatarUrl,
            },
          };
        }
      );
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};

export const useUploadCoverMutation = (props: MutationProps<UpsertProfileResponse, File> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadProfileImage("cover", file),
    onSuccess: async (data) => {
      toast.success("Cover photo updated");
      queryClient.setQueryData(
        SOCIAL_KEYS.profile(data.profile.userId),
        (old: GetProfileResponse) => {
          return {
            ...old,
            profile: {
              ...old.profile,
              coverUrl: data.profile.coverUrl,
            },
          };
        }
      );
    },
    onError: (error) => toast.error(asError(error).message),
    ...props,
  });
};
