/**
 * Site-wide password gate shared by `proxy.ts` and the `/password` page.
 * The gate is on only when `SITE_PASSWORD` is set (e.g. in Netlify's
 * environment variables); leave it empty locally to browse freely.
 */
export const SITE_AUTH_COOKIE = "site-auth";
export const SITE_AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const sitePassword = () => process.env.SITE_PASSWORD || null;

/**
 * Cookie value for a password: a SHA-256 hash, so the password itself never
 * sits in the browser and changing `SITE_PASSWORD` signs everyone out.
 */
export async function siteAuthToken(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`site-auth:${password}`)
  );
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Only same-site paths are allowed as the post-login destination. */
export const safeNextPath = (next: unknown): string =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
