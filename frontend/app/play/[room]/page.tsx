"use client";

import { use, useRef, useState } from "react";
import { useHoopsLink, type LinkMsg } from "@/lib/hoopsLink";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Predicted arc in a normalized 0..100 pad space (SVG stretches to fit). */
function simArc(power: number, aimX: number): string {
  let x = 50, y = 82;
  let vx = aimX * 5;
  let vy = -(5 + power * 13);
  const g = 2;
  const pts = [`${x},${y}`];
  for (let i = 0; i < 26; i++) {
    x += vx; y += vy; vy += g;
    if (y > 102) break;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}

export default function Play({ params }: { params: Promise<{ room: string }> }) {
  const { room } = use(params);
  const code = room.toUpperCase().slice(0, 6);

  const [you, setYou] = useState(0);
  const [rival, setRival] = useState(0);
  const [secs, setSecs] = useState(60);
  const [phase, setPhase] = useState<string>("intro");
  const [flash, setFlash] = useState<"make" | "miss" | null>(null);
  const [power, setPower] = useState(0);
  const [arc, setArc] = useState("");

  const padRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const lastAim = useRef(0);

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
      setTimeout(() => setFlash(null), 280);
    }
  };

  const { connected, peer, send } = useHoopsLink(code, "pad", onHost);
  const live = connected && peer;

  const calc = (e: React.PointerEvent) => {
    const r = padRef.current!.getBoundingClientRect();
    const s = start.current!;
    const dx = e.clientX - r.left - s.x;
    const dy = e.clientY - r.top - s.y;
    const powr = dy < 0 ? Math.min(1, -dy / (r.height * 0.55)) : 0;
    const aimX = Math.max(-1, Math.min(1, dx / (r.width * 0.5)));
    return { dx, dy, powr, aimX };
  };

  const down = (e: React.PointerEvent) => {
    const r = padRef.current!.getBoundingClientRect();
    start.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const move = (e: React.PointerEvent) => {
    if (!start.current) return;
    const { powr, aimX } = calc(e);
    setPower(powr);
    setArc(powr > 0 ? simArc(powr, aimX) : "");
    const now = performance.now();
    if (now - lastAim.current > 40) {
      lastAim.current = now;
      send({ t: "aim", power: powr, aimX });
    }
  };
  const up = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    setPower(0);
    setArc("");
    if (!s) return;
    const { dy, powr, aimX } = calc(e);
    if (dy > -24) { send({ t: "aimoff" }); return; }
    send({ t: "shoot", power: powr, aimX });
    buzz(12);
  };
  const cancel = () => {
    start.current = null;
    setPower(0);
    setArc("");
    send({ t: "aimoff" });
  };

  return (
    <main className={`play ${flash ? `play-${flash}` : ""}`}>
      <header className="play-top">
        <span className="play-mark">MSG HOOPS</span>
        <span className={`play-dot ${live ? "on" : ""}`}>
          {live ? "Connected" : connected ? "Waiting for the screen…" : "Connecting…"}
        </span>
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
        onPointerCancel={cancel}
      >
        <div className="play-hoop" aria-hidden="true">
          <svg viewBox="0 0 80 34" width="100%" height="100%">
            <rect x="18" y="2" width="44" height="20" rx="3" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <rect x="32" y="9" width="16" height="8" rx="1" fill="none" stroke="#f58426" strokeWidth="2" />
            <ellipse cx="40" cy="25" rx="17" ry="4" fill="none" stroke="#f58426" strokeWidth="2.4" />
          </svg>
        </div>

        <svg className="play-arc" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {arc && <path d={arc} fill="none" stroke="#ffd9a8" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="1 3" opacity="0.9" />}
        </svg>

        <div className="play-ball" style={{ transform: `translateY(${-power * 42}px) scale(${1 + power * 0.12})` }}>
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <circle cx="12" cy="12" r="11" fill="#f4951f" stroke="#7a1405" strokeWidth="0.5" />
            <g stroke="#5a2408" strokeWidth="1.1" fill="none" strokeLinecap="round">
              <path d="M12 1v22M1 12h22M4.5 4.5c5 3.4 5 12.1 0 15.4M19.5 4.5c-5 3.4-5 12.1 0 15.4" />
            </g>
          </svg>
        </div>

        <p className="play-hint">
          {live ? "Pull back to aim · release to shoot" : "Scan the QR on the big screen to connect"}
        </p>
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
