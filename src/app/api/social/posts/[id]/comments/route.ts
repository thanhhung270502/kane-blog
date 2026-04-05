import type { CreateCommentRequest } from "@common";
import type { NextRequest} from "next/server";
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
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor") ?? null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

  try {
    const result = await PostService.getComments(id, limit, cursor);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}

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
    const body: CreateCommentRequest = await request.json();

    if (!body.body?.trim()) {
      return NextResponse.json({ message: "Comment body is required" }, { status: 400 });
    }

    const result = await PostService.createComment(id, user.id, body.body, body.parentId ?? null);
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create comment" }, { status: 500 });
  }
}
