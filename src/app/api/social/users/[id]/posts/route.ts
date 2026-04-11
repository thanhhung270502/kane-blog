import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { PostService } from "@/services/post.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  try {
    const result = await PostService.getUserPosts(id, user.id, limit, cursor);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Failed to fetch user posts" }, { status: 500 });
  }
}
