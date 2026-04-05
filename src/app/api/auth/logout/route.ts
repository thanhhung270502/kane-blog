import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { CookieKeys } from "@/shared";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CookieKeys.ACCESS_TOKEN)?.value;

  if (sessionToken) {
    await AuthService.logout(sessionToken).catch(() => null);
  }

  const response = NextResponse.json({ message: "Logged out" });
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(CookieKeys.ACCESS_TOKEN, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(CookieKeys.REFRESH_TOKEN, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
