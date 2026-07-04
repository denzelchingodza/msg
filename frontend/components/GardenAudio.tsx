"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Garden ambience. Tries to start automatically; if the browser blocks
 * autoplay (they all do until a user gesture), it arms itself and starts
 * on the very first click or key press anywhere. Preference persists.
 */
export default function GardenAudio() {
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  playingRef.current = playing;

  const ensure = () => {
    if (!audioRef.current) {
      const a = new Audio("/audio/garden.mp3");
      a.loop = true;
      a.volume = 0.35;
      audioRef.current = a;
    }
    return audioRef.current;
  };

  useEffect(() => {
    let disposed = false;

    const start = () =>
      ensure()
        .play()
        .then(() => {
          if (!disposed) setPlaying(true);
          localStorage.setItem("msg_sound", "on");
          return true;
        })
        .catch(() => false);

    const stop = () => {
      ensure().pause();
      setPlaying(false);
      localStorage.setItem("msg_sound", "off");
    };

    const toggle = () => (playingRef.current ? stop() : start());

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

    fetch("/audio/garden.mp3", { method: "HEAD" })
      .then(async (r) => {
        const type = r.headers.get("content-type") ?? "";
        if (disposed || !r.ok || type.includes("text/html")) return;
        setAvailable(true);
        if (localStorage.getItem("msg_sound") !== "off") {
          const ok = await start();
          if (!ok) cleanupGesture = armFirstGesture();
        }
      })
      .catch(() => {});

    const onExternal = () => toggle();
    window.addEventListener("msg:sound", onExternal);

    return () => {
      disposed = true;
      cleanupGesture?.();
      window.removeEventListener("msg:sound", onExternal);
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!available) return null;

  const clickToggle = () => window.dispatchEvent(new Event("msg:sound"));

  return (
    <button
      className={`audio-btn ${playing ? "on" : ""}`}
      onClick={clickToggle}
      aria-label={playing ? "Mute the Garden" : "Hear the Garden"}
      title={playing ? "Mute the Garden" : "Hear the Garden"}
    >
      {playing ? "♪ CROWD ON" : "CROWD OFF"}
    </button>
  );
}
