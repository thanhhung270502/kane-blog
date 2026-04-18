import type { UpsertProfileRequest } from "@common";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { PostService } from "@/services/post.service";

export async function GET(_request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { profile } = await PostService.getProfile(user.id);
    return NextResponse.json({ profile, friendshipStatus: null });
  } catch {
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: UpsertProfileRequest = await request.json();
    const result = await PostService.upsertProfile(user.id, {
      username: body.username,
      bio: body.bio,
      avatarPath: body.avatarPath,
      coverPath: body.coverPath,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ message }, { status: 400 });
  }
}
