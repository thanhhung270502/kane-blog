import type { UserObject } from "@common";
import { cookies } from "next/headers";

import { AuthService } from "@/services/auth.service";
import { CookieKeys } from "@/shared";

/**
 * Get the current authenticated user from the session cookie.
 * Returns null if not authenticated or session is expired.
 */
export async function getSessionUser(): Promise<UserObject | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CookieKeys.ACCESS_TOKEN)?.value;

  if (!sessionToken) return null;

  return AuthService.getMe(sessionToken);
}
