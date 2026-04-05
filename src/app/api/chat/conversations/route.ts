import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { ChatService } from "@/services/chat.service";
import { CookieKeys } from "@/shared";

function getStatusFromMessage(message: string): number {
  if (message.includes("not found")) return 404;
  if (message.includes("Unauthorized")) return 401;
  if (message.includes("required") || message.includes("invalid")) return 400;
  if (message.includes("Forbidden")) return 403;
  return 500;
}

// GET /api/chat/conversations — list current user's conversations
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(CookieKeys.ACCESS_TOKEN)?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await AuthService.getMe(token);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const result = await ChatService.listConversations(user.id);
    return NextResponse.json(result);
  } catch (error: Error | unknown) {
    const message = (error as Error)?.message || "Internal server error";
    return NextResponse.json({ message }, { status: getStatusFromMessage(message) });
  }
}

// POST /api/chat/conversations — create a new conversation (auth optional)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(CookieKeys.ACCESS_TOKEN)?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const user = await AuthService.getMe(token);
        userId = user?.id ?? null;
      } catch {
        // anonymous visitor — no user id
      }
    }

    const body = await request.json().catch(() => ({}));
    const metadata = (body?.metadata as Record<string, unknown>) ?? {};

    const result = await ChatService.createConversation(userId, metadata);
    return NextResponse.json(result, { status: 201 });
  } catch (error: Error | unknown) {
    const message = (error as Error)?.message || "Internal server error";
    return NextResponse.json({ message }, { status: getStatusFromMessage(message) });
  }
}
