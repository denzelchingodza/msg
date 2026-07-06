"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const MIN_MS = 700;
const HARD_CAP_MS = 20000;
const ARENA_PATH = "/court";

/**
 * The "Waking the Garden" loading screen.
 *
 * 1. On a fresh full load, it stays up until the page is fully loaded (all
 *    images) AND the free backend has answered a health ping (which warms it).
 * 2. It ALSO shows when you enter the arena (/court) from inside the app —
 *    e.g. the "ENTER THE GARDEN" click — so entering always feels like a
 *    deliberate load-in, and you never watch the arena's images pop in.
 *
 * Other in-app navigation stays instant (no loader), so clicking between
 * sections is snappy.
 */

function waitForPageLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "complete") return resolve();
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function waitForBackend(signal: AbortSignal): Promise<void> {
  return fetch(`${API}/api/health`, { cache: "no-store", signal })
    .then(() => undefined)
    .catch(() => undefined);
}

function waitForImages(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const imgs = Array.from(document.images).filter((i) => !i.complete);
      if (imgs.length === 0) return resolve();
      let remaining = imgs.length;
      const done = () => {
        if (--remaining <= 0) resolve();
      };
      imgs.forEach((i) => {
        i.addEventListener("load", done, { once: true });
        i.addEventListener("error", done, { once: true });
      });
    });
  });
}

export default function WakeGate() {
  const [waking, setWaking] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const pathname = usePathname();
  const firstRender = useRef(true);

  // 1. Fresh full page load.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const start = Date.now();

    const hide = () => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        setTimeout(() => !cancelled && setWaking(false), 450);
      }, wait);
    };

    const cap = setTimeout(hide, HARD_CAP_MS);
    Promise.all([waitForPageLoad(), waitForBackend(controller.signal)]).then(() => {
      clearTimeout(cap);
      hide();
    });

    return () => {
      cancelled = true;
      clearTimeout(cap);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Entering the arena via in-app navigation.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (pathname !== ARENA_PATH) return;

    let cancelled = false;
    const start = Date.now();
    setLeaving(false);
    setWaking(true);

    const hide = () => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        setTimeout(() => !cancelled && setWaking(false), 450);
      }, wait);
    };

    const cap = setTimeout(hide, HARD_CAP_MS);
    waitForImages().then(() => {
      clearTimeout(cap);
      hide();
    });

    return () => {
      cancelled = true;
      clearTimeout(cap);
    };
  }, [pathname]);

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
