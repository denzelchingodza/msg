"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import EdgeFlash from "@/components/EdgeFlash";
import { celebrate } from "@/lib/celebrate";

/* ── tunable feel (distance-based power; trajectory preview shows it) ── */
const ROUND = 60;
const GRAVITY = 0.42;
const K = 0.058; // drag distance → launch velocity
const MAX_V = 27;
const BALL_Y_FRAC = 0.82;
const HOOP_Y_FRAC = 0.27;
const RIM_HALF_FRAC = 0.085;
const HOT_STREAK = 3;
const DOTS = 16;

interface Ball {
  x: number; y: number; vx: number; vy: number;
  flying: boolean; scored: boolean; scale: number;
}

const cap = (v: number) => Math.max(-MAX_V, Math.min(MAX_V, v));

export default function Hoops() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [score, setScore] = useState(0);
  const [opp, setOpp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [time, setTime] = useState(ROUND);
  const [call, setCall] = useState<{ text: string; tone: string; n: number } | null>(null);
  const [flashTone, setFlashTone] = useState<"correct" | "wrong" | null>(null);
  const [flashPulse, setFlashPulse] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const hoopRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<SVGGElement>(null);
  const dotEls = useRef<(HTMLDivElement | null)[]>([]);
  const dims = useRef({ w: 400, h: 720 });
  const ball = useRef<Ball>({ x: 200, y: 590, vx: 0, vy: 0, flying: false, scored: false, scale: 1 });
  const hoopX = useRef(0.5);
  const streakRef = useRef(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const running = useRef(false);

  const rest = useCallback(() => {
    const { w, h } = dims.current;
    ball.current = { x: w / 2, y: h * BALL_Y_FRAC, vx: 0, vy: 0, flying: false, scored: false, scale: 1 };
  }, []);

  const measure = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    dims.current = { w: el.clientWidth, h: el.clientHeight };
    if (!ball.current.flying) rest();
  }, [rest]);

  const hideDots = useCallback(() => {
    dotEls.current.forEach((d) => d && (d.style.opacity = "0"));
  }, []);

  const resolve = useCallback((made: boolean) => {
    setFlashTone(made ? "correct" : "wrong");
    setFlashPulse((p) => p + 1);
    if (made) {
      setCall({ text: ["SWISH!", "COUNT IT!", "WET!", "BANG!"][Math.floor(Math.random() * 4)], tone: "make", n: Date.now() });
      if (netRef.current) { netRef.current.style.animation = "none"; void netRef.current.getBoundingClientRect(); netRef.current.style.animation = "netSway 0.5s ease"; }
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        streakRef.current = ns;
        setBest((b) => Math.max(b, ns));
        if (ns >= 3) celebrate(false);
        return ns;
      });
    } else {
      setCall({ text: ["BRICK.", "OFF THE IRON.", "SHORT.", "AIRBALL."][Math.floor(Math.random() * 4)], tone: "miss", n: Date.now() });
      setStreak(0);
      streakRef.current = 0;
    }
    setTimeout(() => setCall(null), 750);
    setTimeout(rest, 350);
  }, [rest]);

  // Game loop.
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const { w, h } = dims.current;
      const hoopY = h * HOOP_Y_FRAC;
      const startY = h * BALL_Y_FRAC;
      const b = ball.current;
      hoopX.current = streakRef.current >= HOT_STREAK ? 0.5 + 0.3 * Math.sin((now - t0) / 660) : 0.5;
      if (hoopRef.current) hoopRef.current.style.left = `${hoopX.current * 100}%`;
      if (b.flying) {
        const prevY = b.y;
        b.x += b.vx; b.y += b.vy; b.vy += GRAVITY;
        b.scale = 1 - 0.58 * Math.min(Math.max((startY - b.y) / (startY - hoopY), 0), 1);
        const hx = hoopX.current * w;
        const rim = w * RIM_HALF_FRAC * b.scale;
        if (!b.scored && prevY < hoopY && b.y >= hoopY && b.vy > 0 && Math.abs(b.x - hx) < rim) {
          b.scored = true; b.flying = false; resolve(true);
        }
        if (b.flying && (b.y > h + 100 || b.x < -100 || b.x > w + 100)) {
          b.flying = false; if (!b.scored) resolve(false);
        }
      }
      if (ballRef.current) ballRef.current.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) scale(${b.scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [resolve]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (phase !== "playing") return;
    running.current = true;
    const id = setInterval(() => {
      setTime((t) => {
        if (t <= 1) { clearInterval(id); running.current = false; setPhase("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      if (running.current && Math.random() < 0.66) setOpp((o) => o + 1);
    }, 3400);
    return () => clearInterval(id);
  }, [phase]);

  function rel(e: React.PointerEvent) {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function down(e: React.PointerEvent) {
    if (ball.current.flying || phase !== "playing") return;
    drag.current = rel(e);
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const p = rel(e);
    const dx = p.x - d.x, dy = p.y - d.y;
    if (dy > -25) { hideDots(); return; }
    const { w, h } = dims.current;
    let x = w / 2, y = h * BALL_Y_FRAC;
    let vx = cap(dx * K), vy = cap(dy * K);
    for (let i = 0; i < DOTS; i++) {
      for (let s = 0; s < 4; s++) { x += vx; y += vy; vy += GRAVITY; }
      const el = dotEls.current[i];
      if (el) {
        el.style.opacity = String(Math.max(0.15, 0.85 - i * 0.045));
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    }
  }
  function upFn(e: React.PointerEvent) {
    const d = drag.current;
    drag.current = null;
    hideDots();
    if (!d || ball.current.flying || phase !== "playing") return;
    const p = rel(e);
    const dx = p.x - d.x, dy = p.y - d.y;
    if (dy > -25) return;
    const b = ball.current;
    const { w, h } = dims.current;
    b.x = w / 2; b.y = h * BALL_Y_FRAC;
    b.vx = cap(dx * K); b.vy = cap(dy * K);
    b.scored = false; b.flying = true;
  }

  function begin() { rest(); setPhase("playing"); }
  function replay() {
    setScore(0); setOpp(0); setStreak(0); setBest(0); setTime(ROUND);
    streakRef.current = 0; rest(); setPhase("playing");
  }

  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");
  const idle = phase === "playing" && !ball.current.flying;

  return (
    <div ref={wrapRef} className="hoops-full" onPointerDown={down} onPointerMove={move} onPointerUp={upFn} onPointerCancel={upFn} onPointerLeave={upFn}>
      <div className="hoops-floor" aria-hidden="true" />
      <div className="hoops-spot" aria-hidden="true" />
      <EdgeFlash tone={flashTone} pulse={flashPulse} />

      <Link href="/court" className="hoops-exit">← Exit</Link>

      <div className="hoops-board">
        <div className="hb-side"><span>You</span><b>{String(score).padStart(2, "0")}</b></div>
        <div className="hb-clock"><b>{mm}:{ss}</b><i>4th · :{ss}</i></div>
        <div className="hb-side"><span>Rival</span><b>{String(opp).padStart(2, "0")}</b></div>
      </div>

      {streak >= 2 && phase === "playing" && (
        <div className="hoops-streak">🔥 {streak} STRAIGHT{streak >= HOT_STREAK ? " · RIM HEATING UP" : ""}</div>
      )}

      <div ref={hoopRef} className="hoops-hoop" aria-hidden="true">
        <svg viewBox="0 0 220 170" width="100%" height="100%">
          <defs>
            <linearGradient id="board" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#dbe6f5" />
            </linearGradient>
            <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffa34d" /><stop offset="100%" stopColor="#e06b12" />
            </linearGradient>
          </defs>
          <rect x="36" y="6" width="148" height="100" rx="10" fill="url(#board)" stroke="#006bb6" strokeWidth="6" />
          <rect x="80" y="42" width="60" height="44" rx="4" fill="none" stroke="#f58426" strokeWidth="6" />
          <g ref={netRef} style={{ transformOrigin: "110px 116px" }}>
            <path d="M66 118 Q78 150 92 132 M92 132 Q100 156 110 134 M110 134 Q120 156 128 132 M128 132 Q142 150 154 118" stroke="#eef3fb" strokeWidth="2.6" fill="none" opacity="0.9" />
          </g>
          <ellipse cx="110" cy="116" rx="48" ry="12" fill="none" stroke="url(#rim)" strokeWidth="9" />
        </svg>
      </div>

      {Array.from({ length: DOTS }).map((_, i) => (
        <div key={i} ref={(el) => { dotEls.current[i] = el; }} className="hoops-dot" style={{ width: `${Math.max(5, 12 - i * 0.4)}px`, height: `${Math.max(5, 12 - i * 0.4)}px` }} />
      ))}

      <div ref={ballRef} className={`hoops-ball ${idle ? "idle" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <radialGradient id="bg" cx="36%" cy="32%" r="72%">
              <stop offset="0%" stopColor="#ffce8f" /><stop offset="45%" stopColor="#ef7d1f" /><stop offset="100%" stopColor="#a94a0d" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#bg)" stroke="#7a3708" strokeWidth="2" />
          <ellipse cx="36" cy="30" rx="16" ry="10" fill="#fff" opacity="0.28" />
          <path d="M2 50 H98 M50 2 V98 M14 14 Q50 50 14 86 M86 14 Q50 50 86 86" stroke="#5c2a06" strokeWidth="2.4" fill="none" />
        </svg>
      </div>

      {idle && <div className="hoops-grab">drag up to shoot ↑</div>}

      {call && <div key={call.n} className={`hoops-call ${call.tone}`}>{call.text}</div>}

      {phase === "intro" && (
        <div className="hoops-modal">
          <div className="hoops-card">
            <p className="kicker">MSG Hoops</p>
            <h2 className="hoops-modal-title">Drag up to shoot</h2>
            <p className="hoops-modal-body">
              Pull the ball back and up — the dotted arc shows exactly where it&rsquo;s
              going. Sink it in the rim.
            </p>
            <ul className="hoops-rules">
              <li>⏱️ 60 seconds against your Rival</li>
              <li>🔥 3 in a row and the rim starts moving</li>
              <li>💻 click-drag-release &nbsp;·&nbsp; 📱 swipe up</li>
            </ul>
            <button className="btn" onClick={begin}>Start shooting</button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="hoops-modal">
          <div className="hoops-card">
            <p className="kicker">Final buzzer</p>
            <p className="hoops-final">{score}<small> — {opp}</small></p>
            <h2 className="hoops-modal-title">
              {score > opp ? "You beat the Rival" : score === opp ? "Deadlock" : "Rival took it"}
            </h2>
            <p className="hoops-modal-body">Best streak: {best} · {score} buckets</p>
            <button className="btn" onClick={replay}>Run it back</button>
          </div>
        </div>
      )}
    </div>
  );
}
