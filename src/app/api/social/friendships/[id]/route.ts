import type { EFriendshipStatus, RespondFriendRequestRequest } from "@common";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { FriendshipService } from "@/services/friendship.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body: RespondFriendRequestRequest = await request.json();

    if (!body.status || !["accepted", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { message: "status must be 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    const result = await FriendshipService.respondToRequest(
      id,
      user.id,
      body.status as EFriendshipStatus.ACCEPTED | EFriendshipStatus.REJECTED
    );
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to respond to request";
    return NextResponse.json({ message }, { status: 400 });
  }
}

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
    await FriendshipService.removeFriendship(id, user.id);
    return NextResponse.json({ message: "Friendship removed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to remove friendship";
    return NextResponse.json({ message }, { status: 400 });
  }
}
