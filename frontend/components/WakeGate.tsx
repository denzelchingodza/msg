"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const MIN_MS = 700;
const ARENA_PATH = "/court";
const INTRO_VIDEO = "/photos/tip.mp4";

/**
 * "Waking the Garden" loading screen.
 *
 * On entering the arena (/court) for the first time in a session, it plays the
 * tip-in intro video once — trying to include its sound, falling back to muted
 * with a "Sound" button if the browser blocks audio — with a Skip button. The
 * crowd audio (GardenAudio) is signal-driven and only starts once this reveals
 * the page, i.e. AFTER the video ends or is skipped.
 *
 * On other loads it's just a quick branded loader that waits for images + the
 * backend so nothing pops in.
 */

function introPlayed(): boolean {
  try {
    return sessionStorage.getItem("msg_intro_played") === "1";
  } catch {
    return false;
  }
}
function markIntroPlayed() {
  try {
    sessionStorage.setItem("msg_intro_played", "1");
  } catch {
    /* private mode — fine, it just may replay */
  }
}

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
  const [videoMode, setVideoMode] = useState(false);
  const pathname = usePathname();

  const firstRender = useRef(true);
  const cancelled = useRef(false);
  const contentReady = useRef(false);
  const videoDone = useRef(false);
  const cycleArena = useRef(false);
  const startTime = useRef(Date.now());
  const capTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const tryHide = useCallback(() => {
    if (cancelled.current) return;
    if (!(contentReady.current && videoDone.current)) return;
    if (capTimer.current) clearTimeout(capTimer.current);
    const wait = Math.max(0, MIN_MS - (Date.now() - startTime.current));
    setTimeout(() => {
      if (cancelled.current) return;
      setLeaving(true);
      // Crowd audio starts as the loader fades — i.e. after the video.
      if (cycleArena.current) {
        window.dispatchEvent(new Event("msg:sound-start"));
      }
      setTimeout(() => !cancelled.current && setWaking(false), 450);
    }, wait);
  }, []);

  const beginCycle = useCallback(
    (path: string, waitForContent: () => Promise<void>) => {
      const playVideo = path === ARENA_PATH && !introPlayed();
      cycleArena.current = path === ARENA_PATH;
      contentReady.current = false;
      videoDone.current = !playVideo; // no video → nothing to wait on
      startTime.current = Date.now();
      setVideoMode(playVideo);
      setLeaving(false);
      setWaking(true);
      if (playVideo) markIntroPlayed();

      if (capTimer.current) clearTimeout(capTimer.current);
      capTimer.current = setTimeout(
        () => {
          contentReady.current = true;
          videoDone.current = true;
          tryHide();
        },
        playVideo ? 25000 : 8000
      );

      waitForContent().then(() => {
        contentReady.current = true;
        tryHide();
      });
    },
    [tryHide]
  );

  // Fresh full page load.
  useEffect(() => {
    cancelled.current = false;
    const controller = new AbortController();
    beginCycle(pathname ?? "/", () =>
      Promise.all([waitForPageLoad(), waitForBackend(controller.signal)]).then(
        () => undefined
      )
    );
    return () => {
      cancelled.current = true;
      controller.abort();
      if (capTimer.current) clearTimeout(capTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Entering the arena via in-app navigation.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (pathname !== ARENA_PATH) return;
    beginCycle(ARENA_PATH, () => waitForImages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Play the intro video WITH sound. Works automatically when the user has
  // already interacted (e.g. clicked ENTER). If a cold load blocks unmuted
  // autoplay, play muted and switch sound on at the first interaction — no
  // button, no manual step.
  useEffect(() => {
    if (!videoMode) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;

    let cleanupGesture: (() => void) | undefined;
    const armUnmute = () => {
      const onGesture = () => {
        v.muted = false;
        v.play().catch(() => {});
        remove();
      };
      const remove = () => {
        window.removeEventListener("pointerdown", onGesture);
        window.removeEventListener("keydown", onGesture);
        window.removeEventListener("touchstart", onGesture);
      };
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("keydown", onGesture);
      window.addEventListener("touchstart", onGesture);
      return remove;
    };

    v.muted = false;
    v.play().catch(() => {
      // Cold load blocked unmuted autoplay — play muted, unmute on first tap.
      v.muted = true;
      v.play().catch(() => {
        videoDone.current = true;
        tryHide();
      });
      cleanupGesture = armUnmute();
    });

    return () => cleanupGesture?.();
  }, [videoMode, tryHide]);

  const onVideoEnd = () => {
    videoDone.current = true;
    tryHide();
  };
  const onVideoError = () => {
    videoDone.current = true;
    setVideoMode(false);
    tryHide();
  };
  const skip = () => {
    videoRef.current?.pause();
    videoDone.current = true;
    contentReady.current = true;
    tryHide();
  };

  if (!waking) return null;

  return (
    <div className={`wake ${leaving ? "wake-out" : ""}`} aria-live="polite">
      {videoMode ? (
        <>
          <video
            ref={videoRef}
            className="wake-video"
            src={INTRO_VIDEO}
            playsInline
            preload="auto"
            onEnded={onVideoEnd}
            onError={onVideoError}
          />
          <div className="wake-controls">
            <button className="wake-skip" onClick={skip}>
              Skip ›
            </button>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
}
