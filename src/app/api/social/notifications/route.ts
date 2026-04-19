import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { NotificationService } from "@/services/notification.service";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const result = await NotificationService.getNotifications(user.id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}
