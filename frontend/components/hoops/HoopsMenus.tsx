"use client";

import { ReactNode } from "react";

/** Reusable glassmorphism modal shell used by every Hoops menu. */
export function GlassModal({ title, kicker, children, onClose }: {
  title: string;
  kicker?: string;
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="hoops-modal" onClick={onClose}>
      <div className="hoops-card" onClick={(e) => e.stopPropagation()}>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className="hoops-modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/** A single labeled on/off switch. */
function Toggle({ label, on, onToggle, disabled, hint }: {
  label: string; on: boolean; onToggle: () => void; disabled?: boolean; hint?: string;
}) {
  return (
    <button className={`hoops-toggle ${on ? "on" : ""}`} onClick={onToggle} disabled={disabled}>
      <span>{label}{hint && <small>{hint}</small>}</span>
      <i />
    </button>
  );
}

export function PauseMenu({ onResume, onRestart, onSettings, onLocker }: {
  onResume: () => void; onRestart: () => void; onSettings: () => void; onLocker: () => void;
}) {
  return (
    <GlassModal kicker="Timeout" title="Paused">
      <div className="hoops-menu-btns">
        <button className="btn" onClick={onResume}>Resume</button>
        <button className="btn btn-ghost" onClick={onLocker}>🧺 Locker</button>
        <button className="btn btn-ghost" onClick={onRestart}>Restart</button>
        <button className="btn btn-ghost" onClick={onSettings}>Settings</button>
      </div>
    </GlassModal>
  );
}

export function SettingsMenu({ assist, reducedMotion, onAssist, onReduced, onBack }: {
  assist: boolean; reducedMotion: boolean;
  onAssist: () => void; onReduced: () => void; onBack: () => void;
}) {
  return (
    <GlassModal kicker="Settings" title="Options">
      <div className="hoops-settings">
        <Toggle label="Rim assist" hint="magnet helps near misses drop" on={assist} onToggle={onAssist} />
        <Toggle label="Reduced motion" hint="calmer animations" on={reducedMotion} onToggle={onReduced} />
        <Toggle label="Sound" hint="coming soon" on={false} onToggle={() => {}} disabled />
      </div>
      <div className="hoops-menu-btns">
        <button className="btn" onClick={onBack}>Done</button>
      </div>
    </GlassModal>
  );
}

export function DailyPanel({ makes, goal, reward, claimed, onClaim, onClose, canLogin, loginReward, onLogin }: {
  makes: number; goal: number; reward: number; claimed: boolean; onClaim: () => void; onClose: () => void;
  canLogin: boolean; loginReward: number; onLogin: () => void;
}) {
  const done = makes >= goal;
  return (
    <GlassModal kicker="Daily" title={`Make ${goal} threes`} onClose={onClose}>
      {canLogin && (
        <button className="hoops-login" onClick={onLogin}>
          🎁 Daily login bonus <b>+{loginReward} 🪙</b>
        </button>
      )}
      <p className="hoops-modal-body">Sink {goal} today for {reward} 🪙. Resets at midnight.</p>
      <div className="hoops-daily-bar"><i style={{ width: `${Math.min(1, makes / goal) * 100}%` }} /></div>
      <p className="muted" style={{ margin: "10px 0 18px" }}>{Math.min(makes, goal)} / {goal} made</p>
      <div className="hoops-menu-btns">
        {done && !claimed ? (
          <button className="btn" onClick={onClaim}>Claim {reward} 🪙</button>
        ) : (
          <button className="btn btn-ghost" onClick={onClose}>{claimed ? "Claimed today ✓" : "Keep shooting"}</button>
        )}
      </div>
    </GlassModal>
  );
}
