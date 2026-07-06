"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * A branded loading screen shown on every fresh page load. It masks the app
 * assembling (hydration + images) and, more importantly, the free backend
 * waking from sleep. The health ping both times the wait AND warms the server,
 * so the first real click is quick.
 *
 * It shows for at least MIN_MS (so it never flashes), and stays up longer if
 * the backend is cold — until /api/health answers or the hard cap is hit.
 * It lives in the layout, which only mounts on a full load, so it does NOT
 * re-appear on in-app navigation between pages.
 */
const MIN_MS = 1000;
const HARD_CAP_MS = 70000;

export default function WakeGate() {
  const [waking, setWaking] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();
    const controller = new AbortController();
    const hardStop = setTimeout(() => controller.abort(), HARD_CAP_MS);

    const finish = () => {
      if (cancelled) return;
      clearTimeout(hardStop);
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        setTimeout(() => !cancelled && setWaking(false), 450);
      }, wait);
    };

    fetch(`${API}/api/health`, { cache: "no-store", signal: controller.signal })
      .then(finish)
      .catch(finish);

    return () => {
      cancelled = true;
      clearTimeout(hardStop);
      controller.abort();
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
