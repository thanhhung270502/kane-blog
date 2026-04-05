import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationResponse,
  ListConversationsResponse,
} from "@common";
import {
  API_CHAT_CREATE_CONVERSATION,
  API_CHAT_GET_CONVERSATION,
  API_CHAT_LIST_CONVERSATIONS,
} from "@common";

import { getRequest, postRequest } from "@/libs/api-client";

export const createConversation = async (
  data: CreateConversationRequest = {}
): Promise<CreateConversationResponse> => {
  const response = await postRequest({
    path: API_CHAT_CREATE_CONVERSATION.buildUrlPath({}),
    data,
  });
  return response.data;
};

export const listConversations = async (): Promise<ListConversationsResponse> => {
  return await getRequest({ path: API_CHAT_LIST_CONVERSATIONS.buildUrlPath({}) });
};

export const getConversation = async (id: string): Promise<GetConversationResponse> => {
  return await getRequest({ path: API_CHAT_GET_CONVERSATION.buildUrlPath({ id }) });
};

/**
 * Send a message and return an EventSource-compatible ReadableStream.
 * Uses fetch directly to support SSE streaming.
 */
export const sendChatMessage = async (
  conversationId: string,
  content: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError?: (err: string) => void
): Promise<void> => {
  const response = await fetch(
    `/api/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: "Request failed" }));
    onError?.(err.message ?? "Request failed");
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError?.("No response body");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      try {
        const event = JSON.parse(raw) as {
          type: string;
          content?: string;
          id?: string;
        };

        if (event.type === "token" && event.content) {
          onToken(event.content);
        } else if (event.type === "done") {
          onDone();
        }
      } catch {
        // ignore malformed lines
      }
    }
  }
};
