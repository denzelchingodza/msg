"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Garden ambience toggle. Drop a file at frontend/public/audio/garden.mp3
 * and this button appears in the header automatically. Click to fill the
 * room with game night. Browsers require a click before audio can start,
 * so it never autoplays on first visit.
 */
export default function GardenAudio() {
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/audio/garden.mp3", { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        setAvailable(r.ok && !type.includes("text/html"));
      })
      .catch(() => {});
    const onExternal = () => toggleRef.current?.();
    window.addEventListener("msg:sound", onExternal);
    return () => {
      window.removeEventListener("msg:sound", onExternal);
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRef = useRef<(() => void) | null>(null);

  function toggle() {
    if (!audioRef.current) {
      const a = new Audio("/audio/garden.mp3");
      a.loop = true;
      a.volume = 0.35;
      audioRef.current = a;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  toggleRef.current = toggle;

  if (!available) return null;

  return (
    <button
      className={`audio-btn ${playing ? "on" : ""}`}
      onClick={toggle}
      aria-label={playing ? "Mute the Garden" : "Hear the Garden"}
      title={playing ? "Mute the Garden" : "Hear the Garden"}
    >
      {playing ? "SOUND ON" : "SOUND OFF"}
    </button>
  );
}
