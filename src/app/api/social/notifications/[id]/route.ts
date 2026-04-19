import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import { NotificationService } from "@/services/notification.service";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const result = await NotificationService.markAsRead(id, user.id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}
