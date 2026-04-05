/**
 * Base URL used in Google OAuth `redirect_uri` must exactly match an authorized URI in
 * Google Cloud Console. Uses `AUTH_BASE_URL` in production; in development, if the browser's
 * origin differs from `AUTH_BASE_URL` (e.g. 127.0.0.1 vs localhost), uses the request origin.
 */
export function resolveOAuthBaseUrl(request: Request): string {
  const envRaw = process.env.AUTH_BASE_URL?.trim();
  const fromEnv = envRaw?.replace(/\/+$/, "") ?? "";
  const origin = new URL(request.url).origin;

  if (!fromEnv) {
    return origin;
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      if (new URL(fromEnv).origin !== origin) {
        return origin;
      }
    } catch {
      return origin;
    }
  }

  return fromEnv;
}
