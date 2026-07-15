"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import EdgeFlash from "@/components/EdgeFlash";
import HoopsHUD from "@/components/hoops/HoopsHUD";
import { PauseMenu, SettingsMenu, DailyPanel } from "@/components/hoops/HoopsMenus";
import { DAILY_GOAL, DAILY_REWARD, levelFromXp, useHoopsProgress } from "@/lib/hoopsStore";
import { celebrate } from "@/lib/celebrate";

/* ── tunable feel (distance-based power; trajectory preview shows it) ── */
const ROUND = 60;
const GRAVITY = 0.37;
const K = 0.058;
const MAX_V = 27;
const BALL_Y_FRAC = 0.82;
const HOOP_Y_FRAC = 0.3;
const RIM_HALF_FRAC = 0.125;
const ASSIST_FRAC = 0.2;
const HOT_STREAK = 3;
const DOTS = 16;

interface Ball {
  x: number; y: number; vx: number; vy: number;
  flying: boolean; scored: boolean; scale: number;
}
type Overlay = "none" | "pause" | "settings" | "daily";

const cap = (v: number) => Math.max(-MAX_V, Math.min(MAX_V, v));
const multFor = (s: number) => (s >= 9 ? 4 : s >= 6 ? 3 : s >= 3 ? 2 : 1);

export default function Hoops() {
  const { progress, update } = useHoopsProgress();

  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [points, setPoints] = useState(0);
  const [opp, setOpp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(ROUND);
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [settings, setSettings] = useState({ assist: true, reducedMotion: false });
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
  const pointsRef = useRef(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const pausedRef = useRef(false);
  const settingsRef = useRef(settings);

  // Keep refs in sync for the animation loop / handlers.
  useEffect(() => { pausedRef.current = overlay !== "none"; }, [overlay]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { try { const r = localStorage.getItem("msg_hoops_settings"); if (r) setSettings(JSON.parse(r)); } catch {} }, []);

  // Persist only on real changes (avoids overwriting saved prefs on mount).
  const changeSettings = useCallback((fn: (s: typeof settings) => typeof settings) => {
    setSettings((s) => {
      const n = fn(s);
      try { localStorage.setItem("msg_hoops_settings", JSON.stringify(n)); } catch { /* private mode */ }
      return n;
    });
  }, []);

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
      const ns = streakRef.current + 1;
      streakRef.current = ns;
      const m = multFor(ns);
      pointsRef.current += 3 * m; // three-pointers × combo
      setPoints(pointsRef.current);
      setStreak(ns);
      update((prev) => ({
        ...prev,
        coins: prev.coins + 2 * m,
        xp: prev.xp + 10 * m,
        makes: prev.makes + 1,
        dailyMakes: prev.dailyMakes + 1,
      }));
      setCall({ text: ["SWISH!", "COUNT IT!", "WET!", "BANG!"][Math.floor(Math.random() * 4)], tone: "make", n: Date.now() });
      if (netRef.current) { netRef.current.style.animation = "none"; void netRef.current.getBoundingClientRect(); netRef.current.style.animation = "netSway 0.5s ease"; }
      if (ns >= 3) celebrate(false);
    } else {
      streakRef.current = 0;
      setStreak(0);
      setCall({ text: ["BRICK.", "OFF THE IRON.", "SHORT.", "AIRBALL."][Math.floor(Math.random() * 4)], tone: "miss", n: Date.now() });
    }
    setTimeout(() => setCall(null), 750);
    setTimeout(rest, 350);
  }, [rest, update]);

  // Game loop — freezes cleanly while paused (menus open).
  useEffect(() => {
    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last; last = now;
      const { w, h } = dims.current;
      const hoopY = h * HOOP_Y_FRAC;
      const startY = h * BALL_Y_FRAC;
      const b = ball.current;
      if (!pausedRef.current) {
        elapsed += dt;
        hoopX.current = streakRef.current >= HOT_STREAK ? 0.5 + 0.3 * Math.sin(elapsed / 660) : 0.5;
        if (b.flying) {
          const prevY = b.y;
          b.x += b.vx; b.y += b.vy; b.vy += GRAVITY;
          b.scale = 1 - 0.58 * Math.min(Math.max((startY - b.y) / (startY - hoopY), 0), 1);
          const hx = hoopX.current * w;
          const rim = w * RIM_HALF_FRAC * b.scale;
          if (settingsRef.current.assist && b.vy > 0 && Math.abs(b.y - hoopY) < h * 0.07 && Math.abs(b.x - hx) < rim * 1.7) {
            b.x += (hx - b.x) * ASSIST_FRAC;
          }
          if (!b.scored && prevY < hoopY && b.y >= hoopY && b.vy > 0 && Math.abs(b.x - hx) < rim) {
            b.scored = true; b.flying = false; resolve(true);
          }
          if (b.flying && (b.y > h + 100 || b.x < -100 || b.x > w + 100)) {
            b.flying = false; if (!b.scored) resolve(false);
          }
        }
      }
      if (hoopRef.current) hoopRef.current.style.left = `${hoopX.current * 100}%`;
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

  // Clock — pauses with the menus.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setTime((t) => {
        if (t <= 1) { clearInterval(id); setPhase("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Rival.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      if (!pausedRef.current && Math.random() < 0.66) setOpp((o) => o + 1);
    }, 3400);
    return () => clearInterval(id);
  }, [phase]);

  // Bank the result when the buzzer sounds.
  useEffect(() => {
    if (phase !== "done") return;
    update((prev) => ({ ...prev, best: Math.max(prev.best, pointsRef.current), games: prev.games + 1 }));
  }, [phase, update]);

  function rel(e: React.PointerEvent) {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function down(e: React.PointerEvent) {
    if (pausedRef.current || ball.current.flying || phase !== "playing") return;
    drag.current = rel(e);
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || pausedRef.current) return;
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
    if (!d || pausedRef.current || ball.current.flying || phase !== "playing") return;
    const p = rel(e);
    const dx = p.x - d.x, dy = p.y - d.y;
    if (dy > -25) return;
    const b = ball.current;
    const { w, h } = dims.current;
    b.x = w / 2; b.y = h * BALL_Y_FRAC;
    b.vx = cap(dx * K); b.vy = cap(dy * K);
    b.scored = false; b.flying = true;
  }

  function begin() { pointsRef.current = 0; setPoints(0); setStreak(0); streakRef.current = 0; setOpp(0); setTime(ROUND); rest(); setPhase("playing"); }
  function claimDaily() { update((prev) => ({ ...prev, coins: prev.coins + DAILY_REWARD, dailyClaimed: true })); setOverlay("none"); }

  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");
  const idle = phase === "playing" && !ball.current.flying;
  const lv = levelFromXp(progress.xp);

  return (
    <div ref={wrapRef} className={`hoops-full ${settings.reducedMotion ? "rm" : ""}`} onPointerDown={down} onPointerMove={move} onPointerUp={upFn} onPointerCancel={upFn} onPointerLeave={upFn}>
      <div className="hoops-floor" aria-hidden="true" />
      <div className="hoops-spot" aria-hidden="true" />
      <EdgeFlash tone={flashTone} pulse={flashPulse} />

      <Link href="/court" className="hoops-exit">← Exit</Link>

      <div className="hoops-banners" aria-hidden="true">
        <span className="hoops-banner">1970</span>
        <span className="hoops-banner">1973</span>
        <span className="hoops-banner champ">2026</span>
      </div>

      {phase === "playing" && (
        <HoopsHUD
          points={points} mult={multFor(streak)} mm={mm} ss={ss} low={time <= 10}
          rival={opp} coins={progress.coins} level={lv.level} xpPct={lv.pct}
          dailyMakes={progress.dailyMakes} dailyGoal={DAILY_GOAL}
          onPause={() => setOverlay("pause")} onDaily={() => setOverlay("daily")}
        />
      )}

      <div ref={hoopRef} className="hoops-hoop" aria-hidden="true">
        <svg viewBox="0 0 220 170" width="100%" height="100%">
          <defs>
            <linearGradient id="board" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#cfdaeb" />
            </linearGradient>
            <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9a3d" /><stop offset="100%" stopColor="#d9600f" />
            </linearGradient>
          </defs>
          <rect x="34" y="8" width="152" height="98" rx="9" fill="url(#board)" stroke="#9fb0c8" strokeWidth="3" />
          <rect x="37" y="11" width="146" height="92" rx="7" fill="none" stroke="#006bb6" strokeWidth="4" />
          <rect x="80" y="44" width="60" height="40" rx="2" fill="none" stroke="#f58426" strokeWidth="5" />
          <rect x="104" y="104" width="12" height="9" rx="2" fill="#c85a10" />
          <g ref={netRef} style={{ transformOrigin: "110px 120px" }} stroke="#eef3fb" strokeWidth="1.6" fill="none" opacity="0.9">
            <ellipse cx="110" cy="134" rx="34" ry="7" />
            <ellipse cx="110" cy="150" rx="20" ry="5" />
            <path d="M66 121 L86 156 M80 125 L96 156 M95 127 L106 157 M110 128 L110 158 M125 127 L114 157 M140 125 L124 156 M154 121 L134 156" />
          </g>
          <ellipse cx="110" cy="120" rx="48" ry="12.5" fill="none" stroke="#5c2a06" strokeWidth="11" opacity="0.35" />
          <ellipse cx="110" cy="120" rx="48" ry="12.5" fill="none" stroke="url(#rim)" strokeWidth="8" />
          <path d="M62 120 A48 12.5 0 0 0 158 120" fill="none" stroke="#ffc078" strokeWidth="4" opacity="0.85" />
        </svg>
      </div>

      {Array.from({ length: DOTS }).map((_, i) => (
        <div key={i} ref={(el) => { dotEls.current[i] = el; }} className="hoops-dot" style={{ width: `${Math.max(5, 12 - i * 0.4)}px`, height: `${Math.max(5, 12 - i * 0.4)}px` }} />
      ))}

      <div ref={ballRef} className={`hoops-ball ${idle ? "idle" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <radialGradient id="bg" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ffd9a8" /><stop offset="32%" stopColor="#f4951f" />
              <stop offset="78%" stopColor="#cf6416" /><stop offset="100%" stopColor="#8a3c0b" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47.5" fill="url(#bg)" stroke="#5c2a06" strokeWidth="1.5" />
          <g stroke="#3d1c05" strokeWidth="2.4" fill="none" strokeLinecap="round">
            <path d="M50 3 V97" /><path d="M4 50 H96" />
            <path d="M17 13 Q46 50 17 87" /><path d="M83 13 Q54 50 83 87" />
          </g>
          <ellipse cx="35" cy="29" rx="12" ry="7.5" fill="#fff" opacity="0.33" />
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
              Pull the ball back and up — the dotted arc shows exactly where it&rsquo;s going.
              Sink threes, stack a combo, climb the levels.
            </p>
            <ul className="hoops-rules">
              <li>⏱️ 60 seconds · every make is 3 &nbsp;×&nbsp; your combo</li>
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
            <p className="hoops-final">{points}<small> PTS</small></p>
            <h2 className="hoops-modal-title">
              {points > opp * 3 ? "You beat the Rival" : points === opp * 3 ? "Deadlock" : "Rival took it"}
            </h2>
            <p className="hoops-modal-body">Level {lv.level} · Best {Math.max(progress.best, points)} · 🪙 {progress.coins}</p>
            <button className="btn" onClick={begin}>Run it back</button>
          </div>
        </div>
      )}

      {overlay === "pause" && (
        <PauseMenu onResume={() => setOverlay("none")} onRestart={() => { begin(); setOverlay("none"); }} onSettings={() => setOverlay("settings")} />
      )}
      {overlay === "settings" && (
        <SettingsMenu
          assist={settings.assist} reducedMotion={settings.reducedMotion}
          onAssist={() => changeSettings((s) => ({ ...s, assist: !s.assist }))}
          onReduced={() => changeSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }))}
          onBack={() => setOverlay("none")}
        />
      )}
      {overlay === "daily" && (
        <DailyPanel makes={progress.dailyMakes} goal={DAILY_GOAL} reward={DAILY_REWARD} claimed={progress.dailyClaimed} onClaim={claimDaily} onClose={() => setOverlay("none")} />
      )}
    </div>
  );
}
