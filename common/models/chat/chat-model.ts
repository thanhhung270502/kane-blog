// ─── Enums ──────────────────────────────────────────────────────────────────

export enum EChatConversationStatus {
  ACTIVE = "active",
  ESCALATED = "escalated",
  RESOLVED = "resolved",
  ARCHIVED = "archived",
}

export enum EChatMessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  ADMIN = "admin",
}

export enum EChatMessageProvider {
  CLAUDE = "claude",
  HUMAN = "human",
}

// ─── DB Row Types (snake_case) ────────────────────────────────────────────────

export interface ChatConversationRow {
  id: string;
  user_id: string | null;
  status: string;
  assigned_to: string | null;
  escalation_reason: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface ChatMessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  provider: string | null;
  token_count: number | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

// ─── Domain Objects (camelCase) ───────────────────────────────────────────────

export interface ChatConversationObject {
  id: string;
  userId: string | null;
  status: EChatConversationStatus;
  assignedTo: string | null;
  escalationReason: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessageObject {
  id: string;
  conversationId: string;
  role: EChatMessageRole;
  content: string;
  provider: EChatMessageProvider | null;
  tokenCount: number | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request / Response ───────────────────────────────────────────────────────

export interface CreateConversationRequest {
  metadata?: Record<string, unknown>;
}

export interface CreateConversationResponse {
  conversation: ChatConversationObject;
}

export interface GetConversationResponse {
  conversation: ChatConversationObject;
  messages: ChatMessageObject[];
}

export interface ListConversationsResponse {
  conversations: ChatConversationObject[];
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  message: ChatMessageObject;
}
