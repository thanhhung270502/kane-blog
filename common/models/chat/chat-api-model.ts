import { APIBaseRoutes } from "../../constants";
import type { APIDefinition } from "../api-route-model";
import { APIMethod } from "../api-route-model";

import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationResponse,
  ListConversationsResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "./chat-model";

export const API_CHAT_CREATE_CONVERSATION: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.CHAT,
  subUrl: "/conversations",
  requestBody: {} as CreateConversationRequest,
  responseBody: {} as CreateConversationResponse,
  buildUrlPath: () => `${APIBaseRoutes.CHAT}/conversations`,
};

export const API_CHAT_LIST_CONVERSATIONS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.CHAT,
  subUrl: "/conversations",
  responseBody: {} as ListConversationsResponse,
  buildUrlPath: () => `${APIBaseRoutes.CHAT}/conversations`,
};

export const API_CHAT_GET_CONVERSATION: APIDefinition<{ id: string }> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.CHAT,
  subUrl: "/conversations/:id",
  responseBody: {} as GetConversationResponse,
  buildUrlPath: (params) => `${APIBaseRoutes.CHAT}/conversations/${params.id}`,
};

export const API_CHAT_SEND_MESSAGE: APIDefinition<{ id: string }> = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.CHAT,
  subUrl: "/conversations/:id/messages",
  requestBody: {} as SendMessageRequest,
  responseBody: {} as SendMessageResponse,
  buildUrlPath: (params) => `${APIBaseRoutes.CHAT}/conversations/${params.id}/messages`,
};
