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
  dailyDate: string; // YYYY-MM-DD the daily counters belong to
  dailyMakes: number;
  dailyClaimed: boolean;
}

const KEY = "msg_hoops_progress";
export const DAILY_GOAL = 15;
export const DAILY_REWARD = 150;

const FRESH: HoopsProgress = {
  coins: 0, xp: 0, best: 0, games: 0, makes: 0,
  dailyDate: "", dailyMakes: 0, dailyClaimed: false,
};

const today = () => new Date().toISOString().slice(0, 10);

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
