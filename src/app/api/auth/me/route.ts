import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { CookieKeys } from "@/shared";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CookieKeys.ACCESS_TOKEN)?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await AuthService.getMe(sessionToken);

  if (!user) {
    return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 });
  }

  return NextResponse.json(user);
}
