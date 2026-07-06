"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * The free backend naps between visits and takes a while to wake up.
 * On load we ping /api/health. If it answers fast (already awake) the user
 * sees nothing. If it's cold, we show a themed "Waking the Garden" screen
 * until it responds — and the ping itself warms the server, so the first
 * real click is quick.
 */
export default function WakeGate() {
  const [waking, setWaking] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Only show the screen if the backend is slow to answer (i.e. asleep).
    // A warm backend replies in well under this, so nothing flashes.
    const slowTimer = setTimeout(() => {
      if (!cancelled) setWaking(true);
    }, 600);

    // Give a cold start plenty of time, but never hang forever.
    const controller = new AbortController();
    const hardStop = setTimeout(() => controller.abort(), 70000);

    const finish = () => {
      if (cancelled) return;
      clearTimeout(slowTimer);
      clearTimeout(hardStop);
      setLeaving(true);
      setTimeout(() => !cancelled && setWaking(false), 450);
    };

    fetch(`${API}/api/health`, { cache: "no-store", signal: controller.signal })
      .then(finish)
      .catch(finish);

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
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
