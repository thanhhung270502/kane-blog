import { NextResponse } from "next/server";

import { resolveOAuthBaseUrl } from "@/libs/oauth-base-url";
import { CookieKeys } from "@/shared";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = resolveOAuthBaseUrl(request);

  if (!clientId) {
    return NextResponse.json({ message: "Google OAuth is not configured" }, { status: 500 });
  }

  // Generate a random state token for CSRF protection
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const response = NextResponse.redirect(authUrl);
  const secure = process.env.NODE_ENV === "production";

  // Store state in a short-lived httpOnly cookie to validate on callback
  response.cookies.set(CookieKeys.GOOGLE_OAUTH_STATE, state, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 300, // 5 minutes
  });

  return response;
}
