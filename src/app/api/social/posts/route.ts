import type { CreatePostRequest } from "@common";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { PostService } from "@/services/post.service";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: CreatePostRequest = await request.json();

    if (!body.body && (!body.attachments || body.attachments.length === 0) && !body.sharedPostId) {
      return NextResponse.json({ message: "Post must have content, media, or a shared post" }, { status: 400 });
    }

    const result = await PostService.createPost(user.id, body);
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create post" }, { status: 500 });
  }
}
