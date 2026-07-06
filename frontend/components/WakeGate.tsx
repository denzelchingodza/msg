"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * A branded loading screen shown on every fresh page load. It stays up until
 * BOTH:
 *   1. the page has fully loaded (window "load" — all images/resources), and
 *   2. the free backend has answered a health ping (which also warms it),
 * so the user never watches pictures pop in — they see the loading screen,
 * then a finished page.
 *
 * A minimum keeps it from flashing; a hard cap guarantees it never traps the
 * user if a resource stalls. It lives in the layout (mounts once on a full
 * load), so it does NOT re-appear on in-app navigation between pages.
 */
const MIN_MS = 700;
const HARD_CAP_MS = 20000;

export default function WakeGate() {
  const [waking, setWaking] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();
    let pageReady = false;
    let backendReady = false;

    const controller = new AbortController();

    const hide = () => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        setTimeout(() => !cancelled && setWaking(false), 450);
      }, wait);
    };

    const maybeHide = () => {
      if (pageReady && backendReady) hide();
    };

    // 1. Wait for all images/resources on this page to finish loading.
    const onLoad = () => {
      pageReady = true;
      maybeHide();
    };
    if (document.readyState === "complete") {
      pageReady = true;
    } else {
      window.addEventListener("load", onLoad);
    }

    // 2. Warm + wait for the backend.
    fetch(`${API}/api/health`, { cache: "no-store", signal: controller.signal })
      .then(() => {
        backendReady = true;
        maybeHide();
      })
      .catch(() => {
        backendReady = true;
        maybeHide();
      });

    // In case the page was already complete when we mounted.
    maybeHide();

    // Safety: never trap the user.
    const hardStop = setTimeout(() => {
      pageReady = true;
      backendReady = true;
      hide();
    }, HARD_CAP_MS);

    return () => {
      cancelled = true;
      clearTimeout(hardStop);
      controller.abort();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (!waking) return null;

  return (
    <div className={`wake ${leaving ? "wake-out" : ""}`} aria-live="polite">
      <div className="wake-inner">
        <div className="wake-ball" aria-hidden="true">
          🏀
        </div>
        <p className="wake-title">WAKING THE GARDEN</p>
        <p className="wake-sub">the crowd&rsquo;s filing in — one sec…</p>
        <div className="wake-bar" aria-hidden="true">
          <i />
        </div>
      </div>
    </div>
  );
}
