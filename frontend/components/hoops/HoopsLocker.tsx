"use client";

import { useState } from "react";
import Basketball from "./Basketball";
import { BALLS } from "@/lib/hoopsBalls";
import { COURTS } from "@/lib/hoopsCourts";
import { PERKS, NO_PERK } from "@/lib/hoopsPerks";
import { TITLES } from "@/lib/hoopsTitles";
import { ACHIEVEMENTS } from "@/lib/hoopsAchievements";
import { HoopsProgress, levelFromXp } from "@/lib/hoopsStore";

type Tab = "balls" | "courts" | "perks" | "titles" | "cheeves" | "stats";

/** The Locker: gear up (balls, courts, perks, titles), view achievements + stats. */
export default function HoopsLocker({
  progress, onBuy, onEquip, onBuyCourt, onEquipCourt, onEquipTitle, onBuyPerk, onEquipPerk, onClose,
}: {
  progress: HoopsProgress;
  onBuy: (id: string) => void;
  onEquip: (id: string) => void;
  onBuyCourt: (id: string) => void;
  onEquipCourt: (id: string) => void;
  onEquipTitle: (id: string) => void;
  onBuyPerk: (id: string) => void;
  onEquipPerk: (id: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("balls");
  const lv = levelFromXp(progress.xp);

  const stats: [string, number][] = [
    ["Level", lv.level], ["Best game", progress.best], ["Games", progress.games],
    ["Makes", progress.makes], ["Perfects", progress.perfects], ["Best streak", progress.bestStreak],
    ["Total pts", progress.totalPoints], ["Coins", progress.coins],
  ];

  const tabs: [Tab, string][] = [
    ["balls", "Balls"], ["courts", "Courts"], ["perks", "Perks"],
    ["titles", "Titles"], ["cheeves", "Awards"], ["stats", "Stats"],
  ];

  return (
    <div className="hoops-modal" onClick={onClose}>
      <div className="hoops-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="locker-head">
          <h2 className="hoops-modal-title" style={{ margin: 0 }}>Locker</h2>
          <span className="locker-coins">{progress.coins} coins</span>
        </div>

        <div className="locker-tabs">
          {tabs.map(([id, label]) => (
            <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{label}</button>
          ))}
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
                      <button className="ball-btn buy" disabled={progress.coins < b.price} onClick={() => onBuy(b.id)}>Buy {b.price}</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "courts" && (
            <div className="locker-balls">
              {COURTS.map((c) => {
                const owned = progress.ownedCourts.includes(c.id);
                const equipped = progress.equippedCourt === c.id;
                return (
                  <div key={c.id} className={`ball-card ${equipped ? "equipped" : ""}`}>
                    <div
                      className="court-prev"
                      style={{
                        background: `linear-gradient(180deg, ${c.wood[0]}, ${c.wood[1]} 55%, ${c.wood[2]})`,
                        borderColor: c.line,
                      }}
                    >
                      <span className="court-prev-key" style={{ background: c.key }} />
                    </div>
                    <b>{c.name}</b>
                    {equipped ? (
                      <span className="ball-eq">Equipped</span>
                    ) : owned ? (
                      <button className="ball-btn" onClick={() => onEquipCourt(c.id)}>Equip</button>
                    ) : (
                      <button className="ball-btn buy" disabled={progress.coins < c.price} onClick={() => onBuyCourt(c.id)}>Buy {c.price}</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "perks" && (
            <div className="locker-perks">
              {[NO_PERK, ...PERKS].map((pk) => {
                const owned = pk.id === "none" || progress.ownedPerks.includes(pk.id);
                const equipped = progress.equippedPerk === pk.id;
                return (
                  <div key={pk.id} className={`perk-card ${equipped ? "on" : ""}`}>
                    <span className="perk-body"><b>{pk.name}</b><small>{pk.desc}</small></span>
                    {equipped ? (
                      <span className="perk-eq">Active</span>
                    ) : owned ? (
                      <button className="ball-btn" onClick={() => onEquipPerk(pk.id)}>Equip</button>
                    ) : (
                      <button className="ball-btn buy" disabled={progress.coins < pk.price} onClick={() => onBuyPerk(pk.id)}>Buy {pk.price}</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "titles" && (
            <div className="locker-perks">
              {TITLES.map((t) => {
                const unlocked = lv.level >= t.level;
                const equipped = progress.equippedTitle === t.id;
                return (
                  <div key={t.id} className={`perk-card ${equipped ? "on" : ""} ${unlocked ? "" : "locked"}`}>
                    <span className="perk-body"><b>{t.name}</b><small>Reach level {t.level}</small></span>
                    {equipped ? (
                      <span className="perk-eq">Worn</span>
                    ) : unlocked ? (
                      <button className="ball-btn" onClick={() => onEquipTitle(t.id)}>Wear</button>
                    ) : (
                      <span className="perk-lock">Lvl {t.level}</span>
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
                    <span className="cheeve-body"><b>{a.name}</b><small>{a.desc}</small></span>
                    <span className="cheeve-rw">{got ? "Unlocked" : `+${a.reward}`}</span>
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
