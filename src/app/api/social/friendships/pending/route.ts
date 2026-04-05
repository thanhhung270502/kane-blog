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
    const result = await FriendshipService.getPendingRequests(user.id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Failed to fetch pending requests" }, { status: 500 });
  }
}
