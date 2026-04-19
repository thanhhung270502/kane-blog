import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { NotificationService } from "@/services/notification.service";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await NotificationService.markAllAsRead(user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed to mark notifications as read" }, { status: 500 });
  }
}
