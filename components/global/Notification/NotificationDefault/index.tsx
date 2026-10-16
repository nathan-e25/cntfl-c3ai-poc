"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { NotificationData } from "@/lib/sections/types";
import { renderRichText } from "@/lib/contentful/richText";
import "./notification.css";

type NotificationDefaultProps = { notification: NotificationData };

/** Visitor choice, stored for a year: `action` = they dealt with the notice. */
const COOKIE = "c3-privacy-notice";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type Choice = { action: boolean; optOut: boolean };

const readChoice = (): Choice => {
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  const value = raw ? decodeURIComponent(raw.slice(COOKIE.length + 1)) : "";
  return { action: /action:yes/.test(value), optOut: /optout:yes/.test(value) };
};

const writeChoice = (choice: Choice) => {
  const value = `action:${choice.action ? "yes" : "no"},optout:${choice.optOut ? "yes" : "no"}`;
  document.cookie = `${COOKIE}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
  // Let analytics/ads integrations react to the visitor's choice.
  window.dispatchEvent(new CustomEvent("c3:privacy-choice", { detail: choice }));
};

/**
 * Privacy notice bar (bottom) with a "Do Not Sell or Share" opt-out dialog,
 * behaving like the consent banner on c3.ai:
 * - × on the bar, or Save with the box unchecked: hide the notice for good.
 * - Opt-out link: hide the bar, slide the dialog in over a dimmed page and
 *   focus its close button. × / Cancel: back to the bar (Esc and the
 *   backdrop do nothing).
 * - Save with the box checked: show the success note and close after a
 *   countdown (the bar stays dismissed).
 * Rendered only after hydration, once the stored choice is known.
 */
export function NotificationDefault({ notification: n }: NotificationDefaultProps) {
  const dialogId = useId();
  const checkboxId = useId();
  const [ready, setReady] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optOut, setOptOut] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const optOutBtnRef = useRef<HTMLButtonElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const focusTarget = useRef<"dialog" | "bar" | "success" | null>(null);

  useEffect(() => {
    const choice = readChoice();
    // Read the stored choice once on the client (cookies are not available during SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptOut(choice.optOut);
    setBarVisible(!choice.action);
    setReady(true);
  }, []);

  // Move focus after the DOM reflects the new state (as the original does).
  useEffect(() => {
    const target = focusTarget.current;
    focusTarget.current = null;
    if (target === "dialog") dialogCloseRef.current?.focus();
    if (target === "bar") optOutBtnRef.current?.focus();
    if (target === "success") successRef.current?.focus();
  }, [dialogOpen, barVisible, countdown]);

  // Success countdown: tick once a second, close the dialog at zero.
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDialogOpen(false);
      setCountdown(null);
      return;
    }
    const t = window.setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  const dismissBar = () => {
    writeChoice({ action: true, optOut: readChoice().optOut });
    setBarVisible(false);
  };

  const openDialog = () => {
    focusTarget.current = "dialog";
    setBarVisible(false);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    focusTarget.current = "bar";
    setDialogOpen(false);
    setBarVisible(true);
  };

  const save = () => {
    writeChoice({ action: true, optOut });
    if (optOut) {
      focusTarget.current = "success";
      setCountdown(n.countdownSeconds);
    } else {
      setDialogOpen(false);
      setBarVisible(false);
    }
  };

  if (!ready) return null;

  const success = countdown !== null;
  const [subBefore, subAfter = ""] = n.successSubtext.split("{seconds}");

  return (
    <div className="c3-notice">
      <div
        className={`notice-container${barVisible ? "" : " notice-hide"}`}
        role="region"
        aria-label={n.heading ?? "Privacy notice"}
        tabIndex={-1}
      >
        <div className="notice-bar">
          <button type="button" aria-label="Close" className="notice-bar-close" onClick={dismissBar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src="/assets/icons/notice-close.svg" />
          </button>
          <div className="notice">
            <p className="notice-title" aria-level={2} role="heading">
              {n.heading}
            </p>
            <div className="notice-group">
              <div className="notice-des">
                {renderRichText(n.body, { linkClassName: "notice-policy", linkNewTab: true })}
              </div>
              <div className="notice-btn-wrapper" role="group">
                <button
                  ref={optOutBtnRef}
                  type="button"
                  className="notice-btn notice-btn-opt-out"
                  aria-label={n.optOutLabel}
                  aria-haspopup="dialog"
                  aria-controls={dialogId}
                  onClick={openDialog}
                >
                  {n.optOutLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`notice-dialog${dialogOpen ? " notice-dialog-open" : ""}`} tabIndex={-1}>
        <div
          className="notice-dialog-center"
          role="dialog"
          aria-modal="true"
          id={dialogId}
          aria-label={n.modalTitle}
        >
          <div className="notice-dialog-header">
            <span className="notice-dialog-title" aria-level={2} role="heading">
              {n.modalTitle}
            </span>{" "}
            <button
              ref={dialogCloseRef}
              type="button"
              aria-label="Close"
              className="notice-dialog-close"
              onClick={closeDialog}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src="/assets/icons/notice-close.svg" />
            </button>
          </div>
          <div className="notice-dialog-body">
            <div className="notice-dialog-content">{renderRichText(n.modalBody)}</div>
            <div className="notice-separator" />
            <div className="notice-opt-out-wrapper">
              <div className="notice-checkbox-wrapper">
                <input
                  autoComplete="off"
                  className="notice-checkbox"
                  id={checkboxId}
                  type="checkbox"
                  aria-label={`Enable ${n.checkboxLabel}`}
                  checked={optOut}
                  onChange={(e) => setOptOut(e.target.checked)}
                />
                <label htmlFor={checkboxId} className="notice-checkbox-label">
                  {n.checkboxLabel}
                </label>
              </div>
            </div>
          </div>
          <div className="notice-dialog-footer">
            <div className="notice-action-area">
              <div className={`notice-opt-out-btn-wrapper${success ? " notice-hide" : ""}`} role="group">
                <button
                  type="button"
                  aria-label={n.cancelLabel}
                  className="notice-btn notice-btn-cancel"
                  onClick={closeDialog}
                >
                  {n.cancelLabel}
                </button>{" "}
                <button
                  type="button"
                  aria-label={n.saveLabel}
                  className="notice-btn notice-btn-confirm"
                  onClick={save}
                >
                  {n.saveLabel}
                </button>
              </div>
              <div
                ref={successRef}
                className={`notice-success${success ? "" : " notice-hide"}`}
                role="status"
                tabIndex={-1}
              >
                <div className="notice-success-inner">
                  <div className="notice-success-row">
                    <div className="notice-success-icon" aria-hidden="true">
                      <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18.3333 9.23355V10.0002C18.3323 11.7972 17.7504 13.5458 16.6744 14.9851C15.5984 16.4244 14.086 17.4773 12.3628 17.9868C10.6395 18.4963 8.79768 18.4351 7.11202 17.8124C5.42636 17.1896 3.98717 16.0386 3.00909 14.5311C2.03101 13.0236 1.56645 11.2403 1.68469 9.44714C1.80293 7.65402 2.49763 5.94715 3.66519 4.58111C4.83275 3.21506 6.41061 2.26303 8.16345 1.867C9.91629 1.47097 11.7502 1.65216 13.3916 2.38355M18.3333 3.33355L9.99996 11.6752L7.49996 9.17521"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div className="notice-success-text">{n.successText}</div>
                  </div>
                  <div>
                    <p className="notice-success-subtext">
                      {subBefore}
                      <span>{countdown ?? ""}</span>
                      {subAfter}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {n.poweredBy ? (
              <div className="notice-powered-by">
                {n.poweredBy.label}{" "}
                {n.poweredBy.url && n.poweredBy.logoUrl ? (
                  <a aria-label={`Visit ${n.poweredBy.label.replace(/^powered by\s*/i, "") || "provider"} website`} href={n.poweredBy.url} rel="noopener" target="_blank">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" src={n.poweredBy.logoUrl} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={`notice-overlay${dialogOpen ? "" : " notice-hide"}`} />
    </div>
  );
}
