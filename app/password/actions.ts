"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SITE_AUTH_COOKIE,
  SITE_AUTH_MAX_AGE,
  safeNextPath,
  siteAuthToken,
  sitePassword,
} from "@/lib/siteAuth";

export type UnlockState = { error: string | null };

/** Checks the submitted password; on success sets the auth cookie and goes back. */
export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const password = sitePassword();
  const next = safeNextPath(formData.get("next"));
  if (!password) redirect(next);

  const attempt = String(formData.get("password") ?? "");
  const [expected, given] = await Promise.all([siteAuthToken(password), siteAuthToken(attempt)]);
  if (given !== expected) return { error: "Incorrect password. Please try again." };

  (await cookies()).set(SITE_AUTH_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SITE_AUTH_MAX_AGE,
  });
  redirect(next);
}
