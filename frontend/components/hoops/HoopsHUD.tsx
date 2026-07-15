"use client";

/**
 * MSG Hoops — 2K-style heads-up display. Purely presentational: it renders the
 * score, timer, combo, coins, level and XP passed in, and calls back for the
 * pause / daily buttons. Glassmorphism + soft shadows, responsive.
 */
export interface HudProps {
  points: number;
  mult: number;
  mm: string;
  ss: string;
  low: boolean; // clock running low
  rival: number;
  coins: number;
  level: number;
  xpPct: number;
  dailyMakes: number;
  dailyGoal: number;
  onPause: () => void;
  onDaily: () => void;
}

export default function HoopsHUD(p: HudProps) {
  return (
    <div className="hud">
      {/* left: level + xp */}
      <div className="hud-left glass">
        <div className="hud-level">LVL {p.level}</div>
        <div className="hud-xp"><i style={{ width: `${p.xpPct * 100}%` }} /></div>
      </div>

      {/* center: score + clock */}
      <div className="hud-center">
        <div className="hud-score glass">
          <span key={p.points} className="hud-points">{p.points}</span>
          <span className="hud-pts-label">PTS</span>
        </div>
        <div className={`hud-clock glass ${p.low ? "low" : ""}`}>
          {p.mm}:{p.ss}
        </div>
        <div className="hud-rival">vs Rival {p.rival}</div>
      </div>

      {/* right: coins + buttons */}
      <div className="hud-right">
        <div className="hud-coins glass">🪙 {p.coins}</div>
        <button className="hud-btn glass" onClick={p.onDaily} aria-label="Daily challenge" title="Daily challenge">
          🎯<span className="hud-daily-dot">{p.dailyMakes}/{p.dailyGoal}</span>
        </button>
        <button className="hud-btn glass" onClick={p.onPause} aria-label="Pause" title="Pause">⏸</button>
      </div>

      {/* combo indicator */}
      {p.mult > 1 && (
        <div key={p.mult} className={`hud-combo m${p.mult}`}>
          ×{p.mult} <span>COMBO</span>
        </div>
      )}
    </div>
  );
}
