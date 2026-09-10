"use client";

import { use, useRef, useState } from "react";
import { useHoopsLink, type LinkMsg } from "@/lib/hoopsLink";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function Play({ params }: { params: Promise<{ room: string }> }) {
  const { room } = use(params);
  const code = room.toUpperCase().slice(0, 6);

  const [you, setYou] = useState(0);
  const [rival, setRival] = useState(0);
  const [secs, setSecs] = useState(60);
  const [phase, setPhase] = useState<string>("intro");
  const [flash, setFlash] = useState<"make" | "miss" | null>(null);
  const [power, setPower] = useState(0); // live draw for the meter

  const padRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  const buzz = (ms: number | number[]) => {
    try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
  };

  const onHost = (m: LinkMsg) => {
    if (m.t === "state") {
      setYou(Number(m.you) || 0);
      setRival(Number(m.rival) || 0);
      setSecs(Number(m.secs) || 0);
      setPhase(String(m.phase || "intro"));
    } else if (m.t === "result") {
      const made = Boolean(m.made);
      setFlash(made ? "make" : "miss");
      buzz(made ? (m.perfect ? [12, 40, 12] : 18) : 8);
      setTimeout(() => setFlash(null), 260);
    }
  };

  const { connected, peer, send } = useHoopsLink(code, "pad", onHost);

  const pt = (e: React.PointerEvent) => {
    const r = padRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  };
  const down = (e: React.PointerEvent) => {
    const p = pt(e);
    start.current = { x: p.x, y: p.y };
  };
  const move = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s) return;
    const p = pt(e);
    const dy = p.y - s.y;
    setPower(dy < 0 ? Math.min(1, -dy / (p.h * 0.55)) : 0);
  };
  const up = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    setPower(0);
    if (!s) return;
    const p = pt(e);
    const dx = p.x - s.x;
    const dy = p.y - s.y;
    if (dy > -24) return; // must swipe up
    const power = Math.min(1, -dy / (p.h * 0.55));
    const aimX = Math.max(-1, Math.min(1, dx / (p.w * 0.5)));
    send({ t: "shoot", power, aimX });
    buzz(10);
    setFlash("make");
    setTimeout(() => setFlash(null), 120);
  };

  const live = connected && peer;

  return (
    <main className={`play ${flash ? `play-${flash}` : ""}`}>
      <header className="play-top">
        <span className="play-mark">MSG HOOPS</span>
        <span className={`play-dot ${live ? "on" : ""}`}>{live ? "Connected" : connected ? "Waiting for the screen…" : "Connecting…"}</span>
      </header>

      <div className="play-score">
        <div className="ps-col"><b>{you}</b><span>You</span></div>
        <div className="ps-col ps-clock"><b>{fmt(secs)}</b><span>Clock</span></div>
        <div className="ps-col"><b>{rival}</b><span>Rival</span></div>
      </div>

      <div
        ref={padRef}
        className="play-pad"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => { start.current = null; setPower(0); }}
      >
        <div className="play-ball" style={{ transform: `translateY(${-power * 40}px) scale(${1 + power * 0.12})` }}>
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <circle cx="12" cy="12" r="11" fill="#f4951f" stroke="#7a1405" strokeWidth="0.5" />
            <g stroke="#5a2408" strokeWidth="1.1" fill="none" strokeLinecap="round">
              <path d="M12 1v22M1 12h22M4.5 4.5c5 3.4 5 12.1 0 15.4M19.5 4.5c-5 3.4-5 12.1 0 15.4" />
            </g>
          </svg>
        </div>
        <p className="play-hint">{live ? "Swipe up to shoot" : "Open MSG Hoops on the big screen and scan the code"}</p>
        <div className="play-meter"><i style={{ height: `${power * 100}%` }} /></div>
      </div>

      {phase !== "playing" && live && (
        <button className="btn play-start" onClick={() => send({ t: "start" })}>
          {phase === "done" ? "Run it back" : "Tip it off"}
        </button>
      )}
      <p className="play-room">Room {code}</p>
    </main>
  );
}
