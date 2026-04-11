import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { FriendshipService } from "@/services/friendship.service";
import { PostService } from "@/services/post.service";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [{ profile }, friendshipStatus] = await Promise.all([
      PostService.getProfile(id),
      FriendshipService.getStatus(user.id, id),
    ]);

    return NextResponse.json({ profile, friendshipStatus });
  } catch {
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}
