import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { resolveOAuthBaseUrl } from "@/libs/oauth-base-url";
import { AuthService } from "@/services/auth.service";
import { CookieKeys } from "@/shared";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  email_verified: boolean;
  picture?: string;
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = resolveOAuthBaseUrl(request);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_not_configured`);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // User denied access on Google's consent screen
  if (error) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_access_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_callback`);
  }

  // Validate CSRF state against cookie
  const cookieStore = await cookies();
  const storedState = cookieStore.get(CookieKeys.GOOGLE_OAUTH_STATE)?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_state`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`);
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Fetch user profile from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=userinfo_failed`);
    }

    const userInfo: GoogleUserInfo = await userInfoRes.json();

    // Sign in or create account
    const session = await AuthService.signInWithGoogle({
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      emailVerified: userInfo.email_verified,
    });

    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.redirect(`${baseUrl}/`);

    // Set session cookie (same as email/password login)
    response.cookies.set(CookieKeys.ACCESS_TOKEN, session.token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: session.expiresInSeconds,
    });

    // Clear the OAuth state cookie
    response.cookies.set(CookieKeys.GOOGLE_OAUTH_STATE, "", {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "server_error";
    const errorParam = message === "Google account email is not verified" ? "email_not_verified" : "server_error";
    return NextResponse.redirect(`${baseUrl}/login?error=${errorParam}`);
  }
}
