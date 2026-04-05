import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { PostService } from "@/services/post.service";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await PostService.deletePost(id, user.id);
    if (!deleted) {
      return NextResponse.json({ message: "Post not found or not authorized" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post deleted" });
  } catch {
    return NextResponse.json({ message: "Failed to delete post" }, { status: 500 });
  }
}
