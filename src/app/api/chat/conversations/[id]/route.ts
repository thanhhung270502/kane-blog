import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { ChatService } from "@/services/chat.service";
import { CookieKeys } from "@/shared";

function getStatusFromMessage(message: string): number {
  if (message.includes("not found")) return 404;
  if (message.includes("Unauthorized")) return 401;
  if (message.includes("Forbidden")) return 403;
  return 500;
}

// GET /api/chat/conversations/[id] — get conversation with messages
export async function GET(
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
        // anonymous
      }
    }

    await ChatService.verifyConversationAccess(id, userId);
    const result = await ChatService.getConversation(id);
    return NextResponse.json(result);
  } catch (error: Error | unknown) {
    const message = (error as Error)?.message || "Internal server error";
    return NextResponse.json({ message }, { status: getStatusFromMessage(message) });
  }
}
