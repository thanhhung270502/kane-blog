import type { ToggleReactionRequest } from "@common";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { PostService } from "@/services/post.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body: ToggleReactionRequest = await request.json().catch(() => ({}));
    const result = await PostService.toggleReaction(id, user.id, body.type ?? "like");
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Failed to toggle reaction" }, { status: 500 });
  }
}
