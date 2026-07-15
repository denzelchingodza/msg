"use client";

import { useState } from "react";
import Basketball from "./Basketball";
import { BALLS } from "@/lib/hoopsBalls";
import { ACHIEVEMENTS } from "@/lib/hoopsAchievements";
import { HoopsProgress, levelFromXp } from "@/lib/hoopsStore";

type Tab = "balls" | "cheeves" | "stats";

/** The Locker: buy/equip basketballs, view achievements and player stats. */
export default function HoopsLocker({ progress, onBuy, onEquip, onClose }: {
  progress: HoopsProgress;
  onBuy: (id: string) => void;
  onEquip: (id: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("balls");
  const lv = levelFromXp(progress.xp);

  const stats: [string, number][] = [
    ["Level", lv.level], ["Best game", progress.best], ["Games", progress.games],
    ["Makes", progress.makes], ["Perfects", progress.perfects], ["Best streak", progress.bestStreak],
    ["Total pts", progress.totalPoints], ["Coins", progress.coins],
  ];

  return (
    <div className="hoops-modal" onClick={onClose}>
      <div className="hoops-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="locker-head">
          <h2 className="hoops-modal-title" style={{ margin: 0 }}>Locker</h2>
          <span className="locker-coins">🪙 {progress.coins}</span>
        </div>

        <div className="locker-tabs">
          <button className={tab === "balls" ? "on" : ""} onClick={() => setTab("balls")}>Balls</button>
          <button className={tab === "cheeves" ? "on" : ""} onClick={() => setTab("cheeves")}>Achievements</button>
          <button className={tab === "stats" ? "on" : ""} onClick={() => setTab("stats")}>Stats</button>
        </div>

        <div className="locker-body">
          {tab === "balls" && (
            <div className="locker-balls">
              {BALLS.map((b) => {
                const owned = progress.ownedBalls.includes(b.id);
                const equipped = progress.equippedBall === b.id;
                return (
                  <div key={b.id} className={`ball-card ${equipped ? "equipped" : ""}`}>
                    <div className="ball-prev"><Basketball skin={b} gid={`shop-${b.id}`} /></div>
                    <b>{b.name}</b>
                    {equipped ? (
                      <span className="ball-eq">Equipped</span>
                    ) : owned ? (
                      <button className="ball-btn" onClick={() => onEquip(b.id)}>Equip</button>
                    ) : (
                      <button className="ball-btn buy" disabled={progress.coins < b.price} onClick={() => onBuy(b.id)}>🪙 {b.price}</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "cheeves" && (
            <div className="locker-cheeves">
              {ACHIEVEMENTS.map((a) => {
                const got = progress.achievements.includes(a.id);
                return (
                  <div key={a.id} className={`cheeve ${got ? "got" : ""}`}>
                    <span className="cheeve-ic">{got ? a.icon : "🔒"}</span>
                    <span className="cheeve-body"><b>{a.name}</b><small>{a.desc}</small></span>
                    <span className="cheeve-rw">{got ? "✓" : `+${a.reward}`}</span>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "stats" && (
            <div className="locker-stats">
              {stats.map(([k, v]) => (
                <div key={k} className="stat-card"><b>{v}</b><span>{k}</span></div>
              ))}
            </div>
          )}
        </div>

        <div className="hoops-menu-btns" style={{ marginTop: 16 }}>
          <button className="btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
