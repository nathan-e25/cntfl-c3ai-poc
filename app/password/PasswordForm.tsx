"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { unlock, type UnlockState } from "./actions";

const initialState: UnlockState = { error: null };

export function PasswordForm() {
  const next = useSearchParams().get("next") ?? "/";
  const [state, formAction, pending] = useActionState(unlock, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="site-password" className="text-[14px] leading-[20px] text-[var(--c3-white-70)]">
        Password
      </label>
      <input
        id="site-password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "site-password-error" : undefined}
        className="h-[48px] w-full border border-[color:var(--c3-white-20)] bg-transparent px-4 text-[16px] text-[var(--c3-white)] outline-none focus:border-[color:var(--c3-white)]"
      />
      {state.error ? (
        <p id="site-password-error" role="alert" className="text-[14px] leading-[20px] text-[var(--c3-white)]">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-[48px] w-full bg-[var(--c3-white)] font-[family-name:var(--font-c3-mono)] text-[14px] font-medium uppercase tracking-[0.04em] text-[var(--c3-ink)] transition-colors hover:bg-[var(--c3-light-bg-hover)] disabled:opacity-60"
      >
        {pending ? "Checking…" : "Enter site"}
      </button>
    </form>
  );
}
