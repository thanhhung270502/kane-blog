"use client";

import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationResponse,
  ListConversationsResponse,
} from "@common";
import { toast } from "sonner";

import type { MutationProps, QueryProps } from "@/shared";
import { asError, CHAT_KEYS, useMutation, useQuery, useQueryClient } from "@/shared";
import { createConversation, getConversation, listConversations } from "@/shared/apis";

// ------- List conversations -------
type QueryConversationsProps = QueryProps<ListConversationsResponse>;

export const useQueryConversations = (props: QueryConversationsProps = {}) => {
  return useQuery({
    queryKey: CHAT_KEYS.conversations(),
    queryFn: listConversations,
    ...props,
  });
};

// ------- Get single conversation -------
type QueryConversationProps = QueryProps<GetConversationResponse>;

export const useQueryConversation = (id: string, props: QueryConversationProps = {}) => {
  return useQuery({
    queryKey: CHAT_KEYS.conversation(id),
    queryFn: () => getConversation(id),
    enabled: !!id,
    ...props,
  });
};

// ------- Create conversation -------
type CreateConversationMutationProps = MutationProps<
  CreateConversationResponse,
  CreateConversationRequest
>;

export const useCreateConversationMutation = (props: CreateConversationMutationProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations() });
    },
    onError: (error) => {
      toast.error(asError(error).message);
    },
    ...props,
  });
};
