import type {
  ChatConversationObject,
  ChatMessageObject,
  CreateConversationResponse,
  GetConversationResponse,
  ListConversationsResponse,
} from "@common";
import { EChatConversationStatus, EChatMessageProvider, EChatMessageRole } from "@common";

import { streamChatResponse } from "@/libs/llm";
import { ChatRepository } from "@/repositories/chat.repository";

// Keywords that trigger escalation to a human agent
const ESCALATION_KEYWORDS = ["human", "agent", "person", "manager", "speak to someone", "real person"];
const SENSITIVE_TOPICS = ["refund", "damage", "broken", "wrong order", "charged twice", "billing"];

function shouldEscalate(message: string): { escalate: boolean; reason: string | null } {
  const lower = message.toLowerCase();

  if (ESCALATION_KEYWORDS.some((kw) => lower.includes(kw))) {
    return { escalate: true, reason: "customer_requested" };
  }

  if (SENSITIVE_TOPICS.some((topic) => lower.includes(topic))) {
    return { escalate: true, reason: "sensitive_topic" };
  }

  return { escalate: false, reason: null };
}

export const ChatService = {
  async createConversation(
    userId: string | null,
    metadata: Record<string, unknown> = {}
  ): Promise<CreateConversationResponse> {
    const conversation = await ChatRepository.createConversation(userId, metadata);
    return { conversation };
  },

  async listConversations(userId: string): Promise<ListConversationsResponse> {
    const conversations = await ChatRepository.listConversationsByUser(userId);
    return { conversations };
  },

  async getConversation(id: string): Promise<GetConversationResponse> {
    const conversation = await ChatRepository.findConversationById(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const messages = await ChatRepository.listMessagesByConversation(id);
    return { conversation, messages };
  },

  /**
   * Save the user message, check escalation triggers, then stream AI response.
   * Returns a ReadableStream of text tokens.
   */
  async sendMessage(
    conversationId: string,
    content: string,
    userId: string | null
  ): Promise<{ userMessage: ChatMessageObject; stream: ReadableStream<Uint8Array> }> {
    const conversation = await ChatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Ownership check — anonymous conversations are accessible to all until assigned
    if (conversation.userId && userId && conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }

    // Save user message
    const userMessage = await ChatRepository.createMessage(
      conversationId,
      EChatMessageRole.USER,
      content
    );

    // Check escalation before AI responds
    const { escalate, reason } = shouldEscalate(content);
    if (escalate) {
      await ChatRepository.updateConversationStatus(
        conversationId,
        EChatConversationStatus.ESCALATED,
        reason ?? undefined
      );

      // Insert system message about escalation
      await ChatRepository.createMessage(
        conversationId,
        EChatMessageRole.SYSTEM,
        `Conversation escalated: ${reason}`
      );

      // Send escalation message as assistant
      const escalationText =
        "Let me connect you with a team member. They'll be with you shortly.";
      await ChatRepository.createMessage(
        conversationId,
        EChatMessageRole.ASSISTANT,
        escalationText,
        EChatMessageProvider.CLAUDE
      );

      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(escalationText));
          controller.close();
        },
      });

      return { userMessage, stream };
    }

    // Fetch conversation history for context
    const history = await ChatRepository.listMessagesByConversation(conversationId);

    // Build streaming response
    const aiStream = streamChatResponse(
      history.filter((m) => m.id !== userMessage.id),
      content
    );

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const token of aiStream) {
            fullResponse += token;
            controller.enqueue(encoder.encode(token));
          }
          // Persist completed AI message only on success
          if (fullResponse) {
            await ChatRepository.createMessage(
              conversationId,
              EChatMessageRole.ASSISTANT,
              fullResponse,
              EChatMessageProvider.CLAUDE
            );
          }
          controller.close();
        } catch (err) {
          console.error("[ChatService] AI stream error:", err);
          controller.error(err);
        }
      },
    });

    return { userMessage, stream };
  },

  async verifyConversationAccess(
    conversationId: string,
    userId: string | null
  ): Promise<ChatConversationObject> {
    const conversation = await ChatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    if (conversation.userId && userId && conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }
    return conversation;
  },
};
