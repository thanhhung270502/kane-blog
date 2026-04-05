import type {
  ChatConversationObject,
  ChatConversationRow,
  ChatMessageObject,
  ChatMessageRow,
  EChatConversationStatus,
  EChatMessageProvider,
  EChatMessageRole,
} from "@common";

import { query } from "@/libs/db";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rowToConversation(row: ChatConversationRow): ChatConversationObject {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status as EChatConversationStatus,
    assignedTo: row.assigned_to,
    escalationReason: row.escalation_reason,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToMessage(row: ChatMessageRow): ChatMessageObject {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role as EChatMessageRole,
    content: row.content,
    provider: (row.provider as EChatMessageProvider) ?? null,
    tokenCount: row.token_count,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const ChatRepository = {
  // ── Conversations ─────────────────────────────────────────────────────────

  async createConversation(
    userId: string | null,
    metadata: Record<string, unknown> = {}
  ): Promise<ChatConversationObject> {
    const result = await query<ChatConversationRow>(
      `INSERT INTO chat_conversations (user_id, metadata)
       VALUES ($1, $2)
       RETURNING id, user_id, status, assigned_to, escalation_reason, metadata, created_at, updated_at, deleted_at`,
      [userId, JSON.stringify(metadata)]
    );
    return rowToConversation(result.rows[0]);
  },

  async findConversationById(id: string): Promise<ChatConversationObject | null> {
    const result = await query<ChatConversationRow>(
      `SELECT id, user_id, status, assigned_to, escalation_reason, metadata, created_at, updated_at, deleted_at
       FROM chat_conversations
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] ? rowToConversation(result.rows[0]) : null;
  },

  async listConversationsByUser(userId: string): Promise<ChatConversationObject[]> {
    const result = await query<ChatConversationRow>(
      `SELECT id, user_id, status, assigned_to, escalation_reason, metadata, created_at, updated_at, deleted_at
       FROM chat_conversations
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY updated_at DESC`,
      [userId]
    );
    return result.rows.map(rowToConversation);
  },

  async updateConversationStatus(
    id: string,
    status: EChatConversationStatus,
    escalationReason?: string
  ): Promise<ChatConversationObject | null> {
    const result = await query<ChatConversationRow>(
      `UPDATE chat_conversations
       SET status = $2, escalation_reason = COALESCE($3, escalation_reason)
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, user_id, status, assigned_to, escalation_reason, metadata, created_at, updated_at, deleted_at`,
      [id, status, escalationReason ?? null]
    );
    return result.rows[0] ? rowToConversation(result.rows[0]) : null;
  },

  // ── Messages ──────────────────────────────────────────────────────────────

  async createMessage(
    conversationId: string,
    role: EChatMessageRole,
    content: string,
    provider: EChatMessageProvider | null = null,
    tokenCount: number | null = null
  ): Promise<ChatMessageObject> {
    const result = await query<ChatMessageRow>(
      `INSERT INTO chat_messages (conversation_id, role, content, provider, token_count)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, conversation_id, role, content, provider, token_count, metadata, created_at, updated_at, deleted_at`,
      [conversationId, role, content, provider, tokenCount]
    );
    return rowToMessage(result.rows[0]);
  },

  async listMessagesByConversation(conversationId: string): Promise<ChatMessageObject[]> {
    const result = await query<ChatMessageRow>(
      `SELECT id, conversation_id, role, content, provider, token_count, metadata, created_at, updated_at, deleted_at
       FROM chat_messages
       WHERE conversation_id = $1 AND deleted_at IS NULL
       ORDER BY created_at ASC`,
      [conversationId]
    );
    return result.rows.map(rowToMessage);
  },
};
