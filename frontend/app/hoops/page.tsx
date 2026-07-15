"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import EdgeFlash from "@/components/EdgeFlash";
import { celebrate } from "@/lib/celebrate";

/* ── tunable feel (calibrated further on real devices) ───────── */
const ROUND = 60;
const GRAVITY = 0.4;
const SENS = 11;
const MAX_V = 34;
const BALL_Y_FRAC = 0.82;
const HOOP_Y_FRAC = 0.26;
const RIM_HALF_FRAC = 0.078;
const HOT_STREAK = 3;
const AIM_MAX = 240;

interface Ball {
  x: number; y: number; vx: number; vy: number;
  flying: boolean; scored: boolean; scale: number;
}

export default function Hoops() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [score, setScore] = useState(0);
  const [opp, setOpp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [time, setTime] = useState(ROUND);
  const [flashTone, setFlashTone] = useState<"correct" | "wrong" | null>(null);
  const [flashPulse, setFlashPulse] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const hoopRef = useRef<HTMLDivElement>(null);
  const aimRef = useRef<HTMLDivElement>(null);
  const dims = useRef({ w: 400, h: 720 });
  const ball = useRef<Ball>({ x: 200, y: 590, vx: 0, vy: 0, flying: false, scored: false, scale: 1 });
  const hoopX = useRef(0.5);
  const streakRef = useRef(0);
  const drag = useRef<{ x: number; y: number; t: number } | null>(null);
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

  const resolve = useCallback((made: boolean) => {
    setFlashTone(made ? "correct" : "wrong");
    setFlashPulse((p) => p + 1);
    if (made) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        streakRef.current = ns;
        setBest((b) => Math.max(b, ns));
        if (ns >= 3) celebrate(false);
        return ns;
      });
    } else {
      setStreak(0);
      streakRef.current = 0;
    }
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

      hoopX.current = streakRef.current >= HOT_STREAK ? 0.5 + 0.3 * Math.sin((now - t0) / 640) : 0.5;
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
      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) scale(${b.scale})`;
      }
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
      if (running.current && Math.random() < 0.68) setOpp((o) => o + 1);
    }, 3300);
    return () => clearInterval(id);
  }, [phase]);

  function relPoint(e: React.PointerEvent) {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function down(e: React.PointerEvent) {
    if (ball.current.flying || phase !== "playing") return;
    const p = relPoint(e);
    drag.current = { x: p.x, y: p.y, t: performance.now() };
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || !aimRef.current) return;
    const p = relPoint(e);
    const dx = p.x - d.x, dy = p.y - d.y;
    const len = Math.min(Math.hypot(dx, dy), AIM_MAX);
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    aimRef.current.style.opacity = dy < -20 ? "1" : "0.25";
    aimRef.current.style.width = `${len}px`;
    aimRef.current.style.transform = `translateY(-50%) rotate(${ang}deg)`;
  }
  function up(e: React.PointerEvent) {
    const d = drag.current;
    drag.current = null;
    if (aimRef.current) { aimRef.current.style.opacity = "0"; aimRef.current.style.width = "0px"; }
    if (!d || ball.current.flying || phase !== "playing") return;
    const p = relPoint(e);
    const dx = p.x - d.x, dy = p.y - d.y;
    if (dy > -25) return;
    const dt = Math.max(50, performance.now() - d.t);
    const cap = (v: number) => Math.max(-MAX_V, Math.min(MAX_V, v));
    const b = ball.current;
    const { w, h } = dims.current;
    b.x = w / 2; b.y = h * BALL_Y_FRAC;
    b.vx = cap((dx / dt) * SENS);
    b.vy = cap((dy / dt) * SENS);
    b.scored = false; b.flying = true;
  }

  function begin() { rest(); setPhase("playing"); }
  function replay() {
    setScore(0); setOpp(0); setStreak(0); setBest(0); setTime(ROUND);
    streakRef.current = 0; rest(); setPhase("playing");
  }

  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <div ref={wrapRef} className="hoops-full" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <EdgeFlash tone={flashTone} pulse={flashPulse} />

      <Link href="/court" className="hoops-exit">← Exit</Link>

      <div className="hoops-board">
        <div className="hb-side"><span>You</span><b>{String(score).padStart(2, "0")}</b></div>
        <div className="hb-clock"><b>{mm}:{ss}</b></div>
        <div className="hb-side"><span>Rival</span><b>{String(opp).padStart(2, "0")}</b></div>
      </div>

      {streak >= 2 && phase === "playing" && <div className="hoops-streak">🔥 {streak} in a row{streak >= HOT_STREAK ? " · rim moving!" : ""}</div>}

      <div ref={hoopRef} className="hoops-hoop" aria-hidden="true">
        <svg viewBox="0 0 200 150" width="100%" height="100%">
          <rect x="34" y="6" width="132" height="92" rx="8" fill="#f7fafc" stroke="#006bb6" strokeWidth="5" />
          <rect x="74" y="40" width="52" height="38" rx="3" fill="none" stroke="#f58426" strokeWidth="5" />
          <ellipse cx="100" cy="104" rx="44" ry="11" fill="none" stroke="#f58426" strokeWidth="8" />
          <path d="M60 108 L74 142 M80 110 L86 146 M100 111 L100 148 M120 110 L114 146 M140 108 L126 142" stroke="#e8eef7" strokeWidth="2.6" fill="none" />
        </svg>
      </div>

      {/* aim guide */}
      <div className="hoops-aim-anchor" style={{ top: `${BALL_Y_FRAC * 100}%` }}>
        <div ref={aimRef} className="hoops-aim" />
      </div>

      <div ref={ballRef} className="hoops-ball" aria-hidden="true">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <radialGradient id="bg" cx="38%" cy="34%" r="70%">
              <stop offset="0%" stopColor="#ffb262" />
              <stop offset="55%" stopColor="#ef7d1f" />
              <stop offset="100%" stopColor="#b4530f" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#bg)" stroke="#7a3708" strokeWidth="2" />
          <path d="M2 50 H98 M50 2 V98 M14 14 Q50 50 14 86 M86 14 Q50 50 86 86" stroke="#5c2a06" strokeWidth="2.4" fill="none" />
        </svg>
      </div>

      {phase === "intro" && (
        <div className="hoops-modal">
          <p className="kicker">MSG Hoops</p>
          <h2 className="hoops-modal-title">DRAG THE BALL UP TO SHOOT</h2>
          <p className="hoops-modal-body">
            Pull the ball up and let go — the further and faster you flick, the
            harder it goes. Arc it through the rim.
          </p>
          <ul className="hoops-rules">
            <li>60 seconds against your Rival</li>
            <li>3 buckets in a row → the rim starts <b>moving</b></li>
            <li>💻 Computer: click-drag-release &nbsp;·&nbsp; 📱 Phone: swipe up</li>
          </ul>
          <button className="btn" onClick={begin}>Start shooting</button>
        </div>
      )}

      {phase === "done" && (
        <div className="hoops-modal">
          <p className="kicker">Final buzzer</p>
          <p className="hoops-final">{score}<small> vs {opp}</small></p>
          <h2 className="hoops-modal-title">
            {score > opp ? "YOU BEAT THE RIVAL" : score === opp ? "DEADLOCK" : "RIVAL TOOK IT"}
          </h2>
          <p className="hoops-modal-body">Best streak: {best} · {score} buckets</p>
          <button className="btn" onClick={replay}>Run it back</button>
        </div>
      )}
    </div>
  );
}
