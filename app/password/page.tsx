import type { Metadata } from "next";
import { Suspense } from "react";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = {
  title: "Password required | C3 AI",
  robots: { index: false, follow: false },
};

/** Login screen for the site-wide password gate (see `proxy.ts`). */
export default function PasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--c3-hero-bg)] px-6 font-[family-name:var(--font-c3-display)] text-[var(--c3-white)]">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
        <svg viewBox="0 0 648 648" width={48} height={48} fill="currentColor" role="img" aria-label="C3 AI">
          <polygon points="0,0 0,72.21 576,72 576,288 144,288 144,360 576,360 576,576 0,576.33 0,648 648,648 648,0" />
          <polygon points="0,144.37 504,144 504,216 72,216 72,432 504,432 504,504 0,503.65" />
        </svg>
        <div className="text-center">
          <h1 className="text-[32px] font-medium leading-[40px]">Password required</h1>
          <p className="mt-2 text-[16px] leading-[24px] text-[var(--c3-white-70)]">
            Enter the password to view this site.
          </p>
        </div>
        <Suspense>
          <PasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
