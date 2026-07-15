"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * On-device progression for MSG Hoops (localStorage).
 * Coins, XP/levels, best score, lifetime + daily stats. This is intentionally
 * a thin, single-source-of-truth store so we can later swap the persistence
 * layer for Supabase without touching the UI.
 */
export interface HoopsProgress {
  coins: number;
  xp: number;
  best: number; // best single-game points
  games: number; // games played
  makes: number; // lifetime makes
  perfects: number; // lifetime perfect (green) makes
  bestStreak: number; // best combo streak ever
  totalPoints: number; // lifetime points
  equippedBall: string; // active ball skin id
  ownedBalls: string[]; // unlocked ball skin ids
  achievements: string[]; // unlocked achievement ids
  dailyDate: string; // YYYY-MM-DD the daily counters belong to
  dailyMakes: number;
  dailyClaimed: boolean;
  loginDate: string; // last day the login bonus was claimed
}

const KEY = "msg_hoops_progress";
export const DAILY_GOAL = 15;
export const DAILY_REWARD = 150;
export const DAILY_LOGIN_REWARD = 50;

const FRESH: HoopsProgress = {
  coins: 0, xp: 0, best: 0, games: 0, makes: 0,
  perfects: 0, bestStreak: 0, totalPoints: 0,
  equippedBall: "classic", ownedBalls: ["classic"], achievements: [],
  dailyDate: "", dailyMakes: 0, dailyClaimed: false, loginDate: "",
};

const today = () => new Date().toISOString().slice(0, 10);
/** Today's date as YYYY-MM-DD (for login-bonus checks in the UI). */
export const todayStr = today;

function load(): HoopsProgress {
  if (typeof window === "undefined") return { ...FRESH };
  try {
    const raw = localStorage.getItem(KEY);
    const p: HoopsProgress = raw ? { ...FRESH, ...JSON.parse(raw) } : { ...FRESH };
    // Roll the daily challenge over at midnight.
    if (p.dailyDate !== today()) {
      p.dailyDate = today();
      p.dailyMakes = 0;
      p.dailyClaimed = false;
    }
    // Safety: everyone always owns the classic ball.
    if (!Array.isArray(p.ownedBalls) || p.ownedBalls.length === 0) p.ownedBalls = ["classic"];
    if (!p.ownedBalls.includes("classic")) p.ownedBalls.push("classic");
    if (!Array.isArray(p.achievements)) p.achievements = [];
    return p;
  } catch {
    return { ...FRESH };
  }
}

function persist(p: HoopsProgress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* private mode */ }
}

/** Level curve: level n starts at 50·(n-1)² XP. */
export function levelFromXp(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const base = 50 * (level - 1) ** 2;
  const need = 50 * (2 * level - 1);
  return { level, into: xp - base, need, pct: Math.min(1, (xp - base) / need) };
}

export function useHoopsProgress() {
  const [progress, setProgress] = useState<HoopsProgress>(FRESH);
  useEffect(() => { setProgress(load()); }, []);

  const update = useCallback((fn: (prev: HoopsProgress) => HoopsProgress) => {
    setProgress((prev) => {
      const next = fn(prev);
      persist(next);
      return next;
    });
  }, []);

  return { progress, update };
}
