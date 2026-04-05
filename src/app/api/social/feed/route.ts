import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { PostService } from "@/services/post.service";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor") ?? null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  try {
    const feed = await PostService.getFeed(user.id, limit, cursor);
    return NextResponse.json(feed);
  } catch {
    return NextResponse.json({ message: "Failed to fetch feed" }, { status: 500 });
  }
}
