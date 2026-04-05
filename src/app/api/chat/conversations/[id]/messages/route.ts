import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { ChatService } from "@/services/chat.service";
import { CookieKeys } from "@/shared";

function getStatusFromMessage(message: string): number {
  if (message.includes("not found")) return 404;
  if (message.includes("Unauthorized")) return 401;
  if (message.includes("required") || message.includes("invalid")) return 400;
  return 500;
}

/**
 * POST /api/chat/conversations/[id]/messages
 *
 * Saves the user message, then streams the AI response token-by-token
 * as a plain text/event-stream (SSE) response.
 *
 * SSE format per token:  data: <token>\n\n
 * End marker:            data: [DONE]\n\n
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get(CookieKeys.ACCESS_TOKEN)?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const user = await AuthService.getMe(token);
        userId = user?.id ?? null;
      } catch {
        // anonymous visitor
      }
    }

    const body = await request.json();
    const content: string = body?.content;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ message: "content is required" }, { status: 400 });
    }

    const { userMessage, stream: aiStream } = await ChatService.sendMessage(
      id,
      content.trim(),
      userId
    );

    // Rate limiting header so frontend knows the user message id immediately
    const encoder = new TextEncoder();

    const sseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        // First event: user message id
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "message_saved", id: userMessage.id })}\n\n`)
        );

        // Stream AI tokens
        const reader = aiStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = new TextDecoder().decode(value);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "token", content: text })}\n\n`)
            );
          }
          // End marker
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (err) {
          const msg = (err as Error)?.message ?? "AI error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", message: msg })}\n\n`)
          );
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(sseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-User-Message-Id": userMessage.id,
      },
    });
  } catch (error: Error | unknown) {
    const message = (error as Error)?.message || "Internal server error";
    return NextResponse.json({ message }, { status: getStatusFromMessage(message) });
  }
}
