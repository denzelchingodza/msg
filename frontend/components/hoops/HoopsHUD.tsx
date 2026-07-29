"use client";

/**
 * MSG Hoops — 2K-style heads-up display. Purely presentational: it renders the
 * score, timer, combo, coins, level and XP passed in, and calls back for the
 * pause / daily buttons. Glassmorphism + soft shadows, responsive.
 */
export interface HudProps {
  points: number;
  mult: number;
  streak: number;
  mm: string;
  ss: string;
  low: boolean; // clock running low
  rival: number;
  coins: number;
  level: number;
  xpPct: number;
  title: string;
  dailyMakes: number;
  dailyGoal: number;
  onPause: () => void;
  onDaily: () => void;
}

export default function HoopsHUD(p: HudProps) {
  return (
    <div className="hud">
      {/* left: level + title + xp */}
      <div className="hud-left glass">
        <div className="hud-level">LVL {p.level}</div>
        <div className="hud-title">{p.title}</div>
        <div className="hud-xp"><i style={{ width: `${p.xpPct * 100}%` }} /></div>
      </div>

      {/* center: slim scoreboard bar */}
      <div className="hud-board glass">
        <div className="hb-col"><b key={p.points} className="hb-score">{p.points}</b><span>You</span></div>
        <div className={`hb-col clock ${p.low ? "low" : ""}`}><b>{p.mm}:{p.ss}</b><span>Clock</span></div>
        <div className="hb-col"><b>{p.rival}</b><span>Rival</span></div>
      </div>

      {/* right: coins + buttons */}
      <div className="hud-right">
        <div className="hud-coins glass"><b>{p.coins}</b><span>Coins</span></div>
        <button className="hud-btn glass" onClick={p.onDaily} aria-label="Daily challenge">
          Daily<span className="hud-daily-dot">{p.dailyMakes}/{p.dailyGoal}</span>
        </button>
        <button className="hud-btn glass" onClick={p.onPause} aria-label="Pause">Pause</button>
      </div>

      {/* combo indicator + flame meter to the next multiplier tier */}
      {p.streak > 0 && (
        <div key={p.mult} className={`hud-combo m${p.mult}`}>
          <div className="hud-combo-top">×{p.mult} <span>COMBO</span></div>
          <div className="hud-combo-meter"><i style={{ width: `${tierPct(p.streak) * 100}%` }} /></div>
          <div className="hud-combo-streak">{p.streak} in a row</div>
        </div>
      )}
    </div>
  );
}

/** Progress toward the next combo multiplier tier (3, 6, 9). */
function tierPct(streak: number): number {
  const tiers = [3, 6, 9];
  const next = tiers.find((t) => streak < t);
  if (next === undefined) return 1;
  const prev = next === 3 ? 0 : next === 6 ? 3 : 6;
  return (streak - prev) / (next - prev);
}
