"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import EdgeFlash from "@/components/EdgeFlash";
import HoopsHUD from "@/components/hoops/HoopsHUD";
import { PauseMenu, SettingsMenu, DailyPanel } from "@/components/hoops/HoopsMenus";
import HoopsLocker from "@/components/hoops/HoopsLocker";
import Basketball from "@/components/hoops/Basketball";
import { ballById } from "@/lib/hoopsBalls";
import { Achievement, newlyUnlocked } from "@/lib/hoopsAchievements";
import { DAILY_GOAL, DAILY_LOGIN_REWARD, DAILY_REWARD, HoopsProgress, levelFromXp, todayStr, useHoopsProgress } from "@/lib/hoopsStore";
import { celebrate } from "@/lib/celebrate";

/* ── tunable feel ─────────────────────────────────────────────── */
const ROUND = 60;
const GRAVITY = 0.37;
const K = 0.058;
const MAX_V = 27;
const BALL_Y_FRAC = 0.82;
const HOOP_Y_FRAC = 0.3;
const RIM_HALF_FRAC = 0.125;
const ASSIST_FRAC = 0.2;
const PERFECT_FRAC = 0.36; // within this share of the rim = PERFECT (green)
const HOT_STREAK = 3;
const DOTS = 16;
const TRAIL = 7;
const SPIN = 5; // ball spin factor
const SPOT_AFTER = 4; // makes before the shooting spot starts moving
const BONUS_EVERY = 13000; // ms between bonus windows
const BONUS_LEN = 5000; // ms a bonus window stays open

interface Ball {
  x: number; y: number; vx: number; vy: number;
  flying: boolean; scored: boolean; scale: number; rot: number; spin: number;
}
type Overlay = "none" | "pause" | "settings" | "daily" | "locker";

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
  const [bonus, setBonus] = useState(false);
  const [burst, setBurst] = useState<{ n: number; x: number; y: number; gold: boolean } | null>(null);
  const [toast, setToast] = useState<Achievement[]>([]);
  const [flashTone, setFlashTone] = useState<"correct" | "wrong" | null>(null);
  const [flashPulse, setFlashPulse] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const hoopRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<SVGGElement>(null);
  const rimRef = useRef<SVGGElement>(null);
  const dotEls = useRef<(HTMLDivElement | null)[]>([]);
  const trailEls = useRef<(HTMLDivElement | null)[]>([]);
  const trailPos = useRef<{ x: number; y: number; s: number }[]>([]);
  const dims = useRef({ w: 400, h: 720 });
  const ball = useRef<Ball>({ x: 200, y: 590, vx: 0, vy: 0, flying: false, scored: false, scale: 1, rot: 0, spin: 0 });
  const hoopX = useRef(0.5);
  const streakRef = useRef(0);
  const pointsRef = useRef(0);
  const makesRef = useRef(0);
  const perfectsRef = useRef(0); // perfects this game
  const maxStreakRef = useRef(0); // best streak this game
  const restXRef = useRef(200);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const pausedRef = useRef(false);
  const settingsRef = useRef(settings);
  const bonusRef = useRef(false);
  const slowMoRef = useRef(false);
  const awaitBuzzerRef = useRef(false);

  useEffect(() => { pausedRef.current = overlay !== "none"; }, [overlay]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { try { const r = localStorage.getItem("msg_hoops_settings"); if (r) setSettings(JSON.parse(r)); } catch {} }, []);
  const changeSettings = useCallback((fn: (s: typeof settings) => typeof settings) => {
    setSettings((s) => { const n = fn(s); try { localStorage.setItem("msg_hoops_settings", JSON.stringify(n)); } catch {} return n; });
  }, []);

  // Position the ball at the (possibly moving) shooting spot.
  const rest = useCallback(() => {
    const { w, h } = dims.current;
    const spot = makesRef.current >= SPOT_AFTER ? 0.3 + Math.random() * 0.4 : 0.5;
    restXRef.current = spot * w;
    ball.current = { x: restXRef.current, y: h * BALL_Y_FRAC, vx: 0, vy: 0, flying: false, scored: false, scale: 1, rot: 0, spin: 0 };
  }, []);
  const measure = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    dims.current = { w: el.clientWidth, h: el.clientHeight };
    if (!ball.current.flying) rest();
  }, [rest]);
  const hideDots = useCallback(() => { dotEls.current.forEach((d) => d && (d.style.opacity = "0")); }, []);

  // Small imperative FX helpers.
  const flick = (ref: React.RefObject<SVGGElement | HTMLDivElement | null>, anim: string, ms: number) => {
    const el = ref.current as HTMLElement | SVGElement | null;
    if (!el || settingsRef.current.reducedMotion) return;
    (el as HTMLElement).style.animation = "none";
    void (el as HTMLElement).getBoundingClientRect();
    (el as HTMLElement).style.animation = `${anim} ${ms}ms ease`;
  };
  const camShake = () => {
    const el = wrapRef.current;
    if (!el || settingsRef.current.reducedMotion) return;
    el.classList.remove("cam-shake"); void el.offsetWidth; el.classList.add("cam-shake");
    setTimeout(() => el.classList.remove("cam-shake"), 430);
  };
  const particleBurst = (gold: boolean) => {
    const { w, h } = dims.current;
    setBurst({ n: Date.now(), x: hoopX.current * w, y: h * HOOP_Y_FRAC, gold });
    setTimeout(() => setBurst(null), 680);
  };

  const resolve = useCallback((made: boolean, perfect: boolean) => {
    setFlashTone(made ? "correct" : "wrong");
    setFlashPulse((p) => p + 1);
    if (made) {
      const ns = streakRef.current + 1; streakRef.current = ns;
      makesRef.current += 1;
      if (ns > maxStreakRef.current) maxStreakRef.current = ns;
      if (perfect) perfectsRef.current += 1;
      const m = multFor(ns);
      const gained = 3 * m * (bonusRef.current ? 2 : 1) * (perfect ? 2 : 1);
      pointsRef.current += gained; setPoints(pointsRef.current);
      setStreak(ns);
      update((prev) => ({
        ...prev,
        coins: prev.coins + 2 * m * (bonusRef.current ? 2 : 1),
        xp: prev.xp + 10 * m,
        makes: prev.makes + 1,
        dailyMakes: prev.dailyMakes + 1,
      }));
      const text = perfect ? "PERFECT!" : bonusRef.current ? "BONUS!" : ["SWISH!", "COUNT IT!", "WET!", "BANG!"][Math.floor(Math.random() * 4)];
      setCall({ text, tone: perfect ? "perfect" : "make", n: Date.now() });
      flick(netRef, "netSway", 500);
      flick(rimRef, "rimVibe", 320);
      particleBurst(perfect || bonusRef.current);
      if (perfect) { camShake(); celebrate(true); }
      else if (ns >= 3) celebrate(false);
    } else {
      streakRef.current = 0; setStreak(0);
      setCall({ text: ["BRICK.", "OFF THE IRON.", "SHORT.", "AIRBALL."][Math.floor(Math.random() * 4)], tone: "miss", n: Date.now() });
    }
    setTimeout(() => setCall(null), 800);
    if (awaitBuzzerRef.current) {
      awaitBuzzerRef.current = false; slowMoRef.current = false;
      if (made) celebrate(true);
      setTimeout(() => setPhase("done"), 700);
    } else {
      setTimeout(rest, 350);
    }
  }, [rest, update]);

  // Game loop.
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
      const sf = slowMoRef.current ? 0.35 : 1; // buzzer-beater slow motion

      if (!pausedRef.current) {
        elapsed += dt;
        const moveSpeed = 660 / (1 + makesRef.current * 0.05); // difficulty ramp
        hoopX.current = streakRef.current >= HOT_STREAK ? 0.5 + 0.3 * Math.sin(elapsed / moveSpeed) : 0.5;
        if (b.flying) {
          const prevY = b.y;
          b.x += b.vx * sf; b.y += b.vy * sf; b.vy += GRAVITY * sf; b.rot += b.spin * sf;
          b.scale = 1 - 0.58 * Math.min(Math.max((startY - b.y) / (startY - hoopY), 0), 1);
          const hx = hoopX.current * w;
          const rim = w * RIM_HALF_FRAC * b.scale;
          if (settingsRef.current.assist && b.vy > 0 && Math.abs(b.y - hoopY) < h * 0.07 && Math.abs(b.x - hx) < rim * 1.7) {
            b.x += (hx - b.x) * ASSIST_FRAC;
          }
          // record trail
          trailPos.current.unshift({ x: b.x, y: b.y, s: b.scale });
          if (trailPos.current.length > TRAIL) trailPos.current.pop();
          if (!b.scored && prevY < hoopY && b.y >= hoopY && b.vy > 0 && Math.abs(b.x - hx) < rim) {
            b.scored = true; b.flying = false;
            resolve(true, Math.abs(b.x - hx) < rim * PERFECT_FRAC);
          }
          if (b.flying && (b.y > h + 100 || b.x < -100 || b.x > w + 100)) {
            b.flying = false; if (!b.scored) resolve(false, false);
          }
        }
      }
      // paint trail
      for (let i = 0; i < TRAIL; i++) {
        const el = trailEls.current[i];
        const p = trailPos.current[i];
        if (el) {
          if (b.flying && p) {
            el.style.opacity = String(0.4 * (1 - i / TRAIL));
            el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${p.s * 0.9})`;
          } else el.style.opacity = "0";
        }
      }
      if (hoopRef.current) hoopRef.current.style.left = `${hoopX.current * 100}%`;
      if (ballRef.current) ballRef.current.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) scale(${b.scale}) rotate(${b.rot}deg)`;
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

  // Clock — pauses with menus, and lets a shot in flight finish in slow-mo (buzzer beater).
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setTime((t) => {
        if (t <= 1) {
          clearInterval(id);
          if (ball.current.flying) { slowMoRef.current = true; awaitBuzzerRef.current = true; }
          else setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Rival.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => { if (!pausedRef.current && Math.random() < 0.66) setOpp((o) => o + 1); }, 3400);
    return () => clearInterval(id);
  }, [phase]);

  // Bonus windows (golden rim, double points).
  useEffect(() => {
    if (phase !== "playing") return;
    let on: ReturnType<typeof setTimeout>, off: ReturnType<typeof setTimeout>;
    const cycle = () => {
      on = setTimeout(() => {
        bonusRef.current = true; setBonus(true);
        off = setTimeout(() => { bonusRef.current = false; setBonus(false); cycle(); }, BONUS_LEN);
      }, BONUS_EVERY);
    };
    cycle();
    return () => { clearTimeout(on); clearTimeout(off); bonusRef.current = false; setBonus(false); };
  }, [phase]);

  // Bank the game + check achievements when the buzzer sounds.
  useEffect(() => {
    if (phase !== "done") return;
    const gained = pointsRef.current;
    const np: HoopsProgress = {
      ...progress,
      best: Math.max(progress.best, gained),
      games: progress.games + 1,
      totalPoints: progress.totalPoints + gained,
      perfects: progress.perfects + perfectsRef.current,
      bestStreak: Math.max(progress.bestStreak, maxStreakRef.current),
    };
    const unlocked = newlyUnlocked(np);
    if (unlocked.length) {
      np.achievements = [...np.achievements, ...unlocked.map((a) => a.id)];
      np.coins += unlocked.reduce((s, a) => s + a.reward, 0);
      setToast(unlocked);
      setTimeout(() => setToast([]), 4200);
    }
    update(() => np);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const buyBall = (id: string) => update((prev) => {
    const skin = ballById(id);
    if (prev.ownedBalls.includes(id) || prev.coins < skin.price) return prev;
    return { ...prev, coins: prev.coins - skin.price, ownedBalls: [...prev.ownedBalls, id], equippedBall: id };
  });
  const equipBall = (id: string) => update((prev) => (prev.ownedBalls.includes(id) ? { ...prev, equippedBall: id } : prev));
  const claimLogin = () => update((prev) => (prev.loginDate === todayStr() ? prev : { ...prev, coins: prev.coins + DAILY_LOGIN_REWARD, loginDate: todayStr() }));

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
    const { h } = dims.current;
    let x = restXRef.current, y = h * BALL_Y_FRAC;
    let vx = cap(dx * K), vy = cap(dy * K);
    for (let i = 0; i < DOTS; i++) {
      for (let s = 0; s < 4; s++) { x += vx; y += vy; vy += GRAVITY; }
      const el = dotEls.current[i];
      if (el) { el.style.opacity = String(Math.max(0.15, 0.85 - i * 0.045)); el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; }
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
    const { h } = dims.current;
    b.x = restXRef.current; b.y = h * BALL_Y_FRAC;
    b.vx = cap(dx * K); b.vy = cap(dy * K);
    b.rot = 0; b.spin = b.vx * SPIN;
    b.scored = false; b.flying = true;
    trailPos.current = [];
  }

  function begin() {
    pointsRef.current = 0; setPoints(0); setStreak(0); streakRef.current = 0;
    makesRef.current = 0; perfectsRef.current = 0; maxStreakRef.current = 0;
    setOpp(0); setTime(ROUND);
    slowMoRef.current = false; awaitBuzzerRef.current = false;
    rest(); setPhase("playing");
  }
  function claimDaily() { update((prev) => ({ ...prev, coins: prev.coins + DAILY_REWARD, dailyClaimed: true })); setOverlay("none"); }

  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");
  const idle = phase === "playing" && !ball.current.flying;
  const lv = levelFromXp(progress.xp);
  const equipped = ballById(progress.equippedBall);

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

      {bonus && phase === "playing" && <div className="hoops-bonus-tag">🔥 2× BONUS</div>}

      <div ref={hoopRef} className={`hoops-hoop ${bonus ? "bonus" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 220 170" width="100%" height="100%">
          <defs>
            <linearGradient id="board" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#cfdaeb" /></linearGradient>
            <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff9a3d" /><stop offset="100%" stopColor="#d9600f" /></linearGradient>
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
          <g ref={rimRef} style={{ transformOrigin: "110px 120px" }}>
            <ellipse cx="110" cy="120" rx="48" ry="12.5" fill="none" stroke="#5c2a06" strokeWidth="11" opacity="0.35" />
            <ellipse cx="110" cy="120" rx="48" ry="12.5" fill="none" stroke="url(#rim)" strokeWidth="8" />
            <path d="M62 120 A48 12.5 0 0 0 158 120" fill="none" stroke="#ffc078" strokeWidth="4" opacity="0.85" />
          </g>
        </svg>
      </div>

      {Array.from({ length: TRAIL }).map((_, i) => (
        <div key={`t${i}`} ref={(el) => { trailEls.current[i] = el; }} className="hoops-trail" aria-hidden="true" />
      ))}

      {Array.from({ length: DOTS }).map((_, i) => (
        <div key={i} ref={(el) => { dotEls.current[i] = el; }} className="hoops-dot" style={{ width: `${Math.max(5, 12 - i * 0.4)}px`, height: `${Math.max(5, 12 - i * 0.4)}px` }} />
      ))}

      <div ref={ballRef} className={`hoops-ball ${idle ? "idle" : ""}`} aria-hidden="true">
        <Basketball skin={equipped} gid="game" />
      </div>

      {burst && (
        <div key={burst.n} className={`hoops-burst ${burst.gold ? "gold" : ""}`} style={{ left: burst.x, top: burst.y }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ ["--a" as string]: `${(i / 14) * 360}deg` } as React.CSSProperties} />
          ))}
        </div>
      )}

      {idle && <div className="hoops-grab">drag up to shoot ↑</div>}
      {call && <div key={call.n} className={`hoops-call ${call.tone}`}>{call.text}</div>}

      {phase === "intro" && (
        <div className="hoops-modal">
          <div className="hoops-card">
            <p className="kicker">MSG Hoops</p>
            <h2 className="hoops-modal-title">Drag up to shoot</h2>
            <p className="hoops-modal-body">Pull the ball back and up — the dotted arc shows where it&rsquo;s going. Swish it dead-center for a green <b>PERFECT</b>.</p>
            <ul className="hoops-rules">
              <li>⏱️ 60s · makes are 3 × your combo</li>
              <li>🎯 PERFECT (center) & 🔥 BONUS windows = 2×</li>
              <li>💻 click-drag-release &nbsp;·&nbsp; 📱 swipe up</li>
            </ul>
            <button className="btn" onClick={begin}>Start shooting</button>
            <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => setOverlay("locker")}>🧺 Locker</button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="hoops-modal">
          <div className="hoops-card">
            <p className="kicker">Final buzzer</p>
            <p className="hoops-final">{points}<small> PTS</small></p>
            <h2 className="hoops-modal-title">{points > opp * 3 ? "You beat the Rival" : points === opp * 3 ? "Deadlock" : "Rival took it"}</h2>
            <p className="hoops-modal-body">Level {lv.level} · Best {Math.max(progress.best, points)} · 🪙 {progress.coins}</p>
            <button className="btn" onClick={begin}>Run it back</button>
          </div>
        </div>
      )}

      {overlay === "pause" && (
        <PauseMenu onResume={() => setOverlay("none")} onRestart={() => { begin(); setOverlay("none"); }} onSettings={() => setOverlay("settings")} onLocker={() => setOverlay("locker")} />
      )}
      {overlay === "locker" && (
        <HoopsLocker progress={progress} onBuy={buyBall} onEquip={equipBall} onClose={() => setOverlay("none")} />
      )}
      {overlay === "settings" && (
        <SettingsMenu assist={settings.assist} reducedMotion={settings.reducedMotion}
          onAssist={() => changeSettings((s) => ({ ...s, assist: !s.assist }))}
          onReduced={() => changeSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }))}
          onBack={() => setOverlay("none")} />
      )}
      {overlay === "daily" && (
        <DailyPanel
          makes={progress.dailyMakes} goal={DAILY_GOAL} reward={DAILY_REWARD} claimed={progress.dailyClaimed}
          onClaim={claimDaily} onClose={() => setOverlay("none")}
          canLogin={progress.loginDate !== todayStr()} loginReward={DAILY_LOGIN_REWARD} onLogin={claimLogin}
        />
      )}

      {toast.length > 0 && (
        <div className="hoops-toast">
          {toast.map((a) => (
            <div key={a.id} className="hoops-toast-row">
              <span>{a.icon}</span>
              <div><b>Achievement unlocked</b><small>{a.name} · +{a.reward} 🪙</small></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
