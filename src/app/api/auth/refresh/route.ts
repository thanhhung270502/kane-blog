import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { CookieKeys } from "@/shared";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CookieKeys.ACCESS_TOKEN)?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "Missing session token" }, { status: 401 });
  }

  const session = await AuthService.refreshSession(sessionToken);

  if (!session) {
    return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 });
  }

  const response = NextResponse.json({ expiresIn: session.expiresInSeconds });
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(CookieKeys.ACCESS_TOKEN, session.token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: session.expiresInSeconds,
  });

  return response;
}
