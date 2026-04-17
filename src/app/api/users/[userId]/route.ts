import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { UserService } from "@/services/user.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const data = await UserService.getById(userId);
    if (!data) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}
