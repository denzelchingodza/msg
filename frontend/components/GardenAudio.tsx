"use client";

import { useEffect, useRef, useState } from "react";

const TRACKS = {
  garden: "/audio/garden.mp3",
  knicks: "/audio/knicks.mp3",
} as const;
type Track = keyof typeof TRACKS;

/**
 * The building's sound system.
 * garden.mp3 is the everyday ambience; knicks.mp3 takes over on pages that
 * request it via  window.dispatchEvent(new CustomEvent("msg:track", {detail:"knicks"})).
 * Starts automatically after the intro's ENTER click (or any first gesture).
 */
export default function GardenAudio() {
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const players = useRef<Partial<Record<Track, HTMLAudioElement>>>({});
  const current = useRef<Track>("garden");
  const playingRef = useRef(false);
  playingRef.current = playing;

  const ensure = (t: Track) => {
    if (!players.current[t]) {
      const a = new Audio(TRACKS[t]);
      a.loop = true;
      a.volume = t === "garden" ? 0.35 : 0.45;
      players.current[t] = a;
    }
    return players.current[t]!;
  };

  useEffect(() => {
    let disposed = false;

    const start = () =>
      ensure(current.current)
        .play()
        .then(() => {
          if (!disposed) setPlaying(true);
          localStorage.setItem("msg_sound", "on");
          return true;
        })
        .catch(() => false);

    const stop = () => {
      Object.values(players.current).forEach((a) => a?.pause());
      setPlaying(false);
      localStorage.setItem("msg_sound", "off");
    };

    const swap = (t: Track) => {
      if (t === current.current) return;
      const was = playingRef.current;
      players.current[current.current]?.pause();
      current.current = t;
      if (was) ensure(t).play().catch(() => {});
    };

    const onToggle = () => (playingRef.current ? stop() : start());
    const onForceStart = () => {
      // Respect a user who muted; otherwise start (or arm the first tap if the
      // browser blocks autoplay). Fired by WakeGate once the intro video ends.
      if (localStorage.getItem("msg_sound") === "off") return;
      start().then((ok) => {
        if (!ok && !disposed) cleanupGesture = armFirstGesture();
      });
    };
    const onTrack = (e: Event) => {
      const t = (e as CustomEvent).detail as Track;
      if (t in TRACKS) swap(t);
    };

    const armFirstGesture = () => {
      const onFirst = () => {
        cleanup();
        if (localStorage.getItem("msg_sound") !== "off") start();
      };
      const cleanup = () => {
        window.removeEventListener("pointerdown", onFirst);
        window.removeEventListener("keydown", onFirst);
      };
      window.addEventListener("pointerdown", onFirst);
      window.addEventListener("keydown", onFirst);
      return cleanup;
    };

    let cleanupGesture: (() => void) | undefined;

    // Only detect availability (to show the toggle). We do NOT auto-start —
    // the crowd is kicked off by WakeGate's "msg:sound-start" after the intro
    // video, so the app stays quiet while the video plays.
    fetch(TRACKS.garden, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (disposed || !r.ok || type.includes("text/html")) return;
        setAvailable(true);
      })
      .catch(() => {});

    window.addEventListener("msg:sound", onToggle);
    window.addEventListener("msg:sound-start", onForceStart);
    window.addEventListener("msg:track", onTrack);

    return () => {
      disposed = true;
      cleanupGesture?.();
      window.removeEventListener("msg:sound", onToggle);
      window.removeEventListener("msg:sound-start", onForceStart);
      window.removeEventListener("msg:track", onTrack);
      Object.values(players.current).forEach((a) => a?.pause());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!available) return null;

  return (
    <button
      className={`audio-btn ${playing ? "on" : ""}`}
      onClick={() => window.dispatchEvent(new Event("msg:sound"))}
      aria-label={playing ? "Mute the Garden" : "Hear the Garden"}
      title={playing ? "Mute the Garden" : "Hear the Garden"}
    >
      {playing ? "♪ CROWD ON" : "CROWD OFF"}
    </button>
  );
}
