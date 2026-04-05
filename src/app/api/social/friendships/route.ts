import type { SendFriendRequestRequest } from "@common";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { FriendshipService } from "@/services/friendship.service";

export async function GET(_request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await FriendshipService.getFriends(user.id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Failed to fetch friends" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: SendFriendRequestRequest = await request.json();

    if (!body.addresseeId) {
      return NextResponse.json({ message: "addresseeId is required" }, { status: 400 });
    }

    const result = await FriendshipService.sendRequest(user.id, body.addresseeId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send friend request";
    return NextResponse.json({ message }, { status: 400 });
  }
}
