"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Concourse from "@/components/Concourse";
import PhotoHero from "@/components/PhotoHero";
import { api, syncProfile } from "@/lib/api";
import { celebrate } from "@/lib/celebrate";

interface Pull {
  text: string;
  rare: boolean;
  tag: string;
}

const STREAK_LINES: [number, string][] = [
  [0, "Press the button. The Garden awaits."],
  [1, "There it is. Another one?"],
  [3, "Heating up. Clyde would say you're stylin' and profilin'."],
  [6, "You're locked in now. Spike just looked over."],
  [10, "DOUBLE DIGITS. Dancing Larry is stretching."],
  [15, "Fifteen deep. Certified Garden session."],
  [25, "Twenty-five?! Someone get this fan a 10-day contract."],
  [40, "FORTY. You are now legally a season ticket holder."],
];

export default function Roulette() {
  const [fact, setFact] = useState<Pull | null>(null);
  const [session, setSession] = useState(0);
  const [allTime, setAllTime] = useState<number | null>(null);
  const [rares, setRares] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const recent = useRef<string[]>([]);

  const streakLine = STREAK_LINES.reduce(
    (acc, [n, line]) => (session >= n ? line : acc),
    STREAK_LINES[0][1]
  );

  const pull = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const exclude = encodeURIComponent(recent.current.join("|"));
      const f = await api<Pull>(`/api/pull?exclude=${exclude}`);
      setOffline(false);
      recent.current = [...recent.current, f.text].slice(-6);
      setFact(f);
      setSession((s) => s + 1);
      if (f.rare) {
        celebrate(true);
        setFlashKey((k) => k + 1);
      }
      const { profile } = await syncProfile(f.rare ? "rare" : "fact");
      setAllTime(profile.total_facts);
      setRares(profile.rare_pulls);
    } catch {
      setOffline(true);
    } finally {
      setBusy(false);
    }
  }, [busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        pull();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pull]);

  return (
    <main className="page compact center">
      {flashKey > 0 && <div key={flashKey} className="flash-overlay" />}
      <p className="kicker">Fact Roulette</p>
      <h1 className="page-title">Bing Bong Machine</h1>
      <p className="page-sub">{streakLine}</p>

      {!fact && (
        <PhotoHero
          src="/photos/the_garden_under_confetti.jpg"
          caption="The Garden, June 2026"
          maxWidth={780}
          height={160}
        />
      )}

      <div
        key={fact?.text ?? "empty"}
        className={`card ticket swap ${fact?.rare ? "card-rare" : ""}`}
        style={{
          maxWidth: 780,
          margin: "36px auto",
          minHeight: 220,
          display: "grid",
          placeItems: "center",
        }}
      >
        {fact ? (
          <div>
            {fact.rare && <span className="badge">★ RARE PULL ★</span>}
            <p className="big-quote" style={{ marginTop: fact.rare ? 20 : 0 }}>
              {fact.text}
            </p>
            {fact.rare && (
              <p className="muted" style={{ marginTop: 16 }}>
                confetti deployed · you earned this
              </p>
            )}
          </div>
        ) : offline ? (
          <span className="offline">
            Garden offline. Start the backend: <code>./dev.sh</code>
          </span>
        ) : (
          <p className="muted" style={{ fontSize: 18 }}>
            53 years of material in here. SPACE works too.
          </p>
        )}
      </div>

      <button className="btn" onClick={pull} disabled={busy}>
        {fact ? "Another one" : "Bing bong. Gimme a fact"}
      </button>

      <p className="muted" style={{ marginTop: 24 }}>
        session {session}
        {allTime !== null && <> · all-time {allTime}</>}
        {rares !== null && <> · rare pulls {rares}</>}
      </p>
      <Concourse />
    </main>
  );
}
