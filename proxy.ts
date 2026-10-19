import { NextResponse, type NextRequest } from "next/server";
import { SITE_AUTH_COOKIE, siteAuthToken, sitePassword } from "@/lib/siteAuth";

/**
 * Password gate: when `SITE_PASSWORD` is set, every page needs the auth
 * cookie set by `/password`; otherwise the visitor is sent there first.
 */
export async function proxy(request: NextRequest) {
  const password = sitePassword();
  if (!password) return NextResponse.next();

  const token = request.cookies.get(SITE_AUTH_COOKIE)?.value;
  if (token && token === (await siteAuthToken(password))) {
    const response = NextResponse.next();
    // Keep the protected site out of search engines.
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const url = new URL("/password", request.url);
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next !== "/") url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the password page itself and the files it needs.
  matcher: ["/((?!password|_next/|favicon\\.ico|icon\\.svg|assets/).*)"],
};
