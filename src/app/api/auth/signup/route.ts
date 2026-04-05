import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { CookieKeys } from "@/shared";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Delegate to Service Layer
    const { user, session } = await AuthService.register(email, password, name);

    const response = NextResponse.json({
      user,
      expiresIn: session.expiresInSeconds,
    });

    const secure = process.env.NODE_ENV === "production";

    // Controller handles setting HTTP context (Cookies)
    response.cookies.set(CookieKeys.ACCESS_TOKEN, session.token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: session.expiresInSeconds,
    });

    return response;
  } catch (error: Error | any) {
    const message = error?.message || "Internal server error";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ message }, { status });
  }
}
