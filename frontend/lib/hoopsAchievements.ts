import { HoopsProgress, levelFromXp } from "./hoopsStore";

/** Achievement definitions — tested against cumulative progress. */
export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  reward: number; // coins on unlock
  test: (p: HoopsProgress) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first", name: "First Bucket", desc: "Make your first shot", icon: "🏀", reward: 20, test: (p) => p.makes >= 1 },
  { id: "sharp", name: "Sharpshooter", desc: "10 lifetime PERFECT swishes", icon: "🎯", reward: 60, test: (p) => p.perfects >= 10 },
  { id: "combo", name: "Combo King", desc: "Hit an 8-shot streak", icon: "🔥", reward: 80, test: (p) => p.bestStreak >= 8 },
  { id: "century", name: "Century", desc: "Score 100 in a game", icon: "💯", reward: 100, test: (p) => p.best >= 100 },
  { id: "grinder", name: "Gym Rat", desc: "Play 10 games", icon: "⛹️", reward: 50, test: (p) => p.games >= 10 },
  { id: "level5", name: "Rising Star", desc: "Reach level 5", icon: "⭐", reward: 80, test: (p) => levelFromXp(p.xp).level >= 5 },
  { id: "collector", name: "Collector", desc: "Own 3 basketballs", icon: "🧺", reward: 70, test: (p) => p.ownedBalls.length >= 3 },
  { id: "grand", name: "Bucket Farm", desc: "Bank 500 lifetime points", icon: "🪙", reward: 60, test: (p) => p.totalPoints >= 500 },
  { id: "legend", name: "Garden Legend", desc: "Score 200 in a game", icon: "👑", reward: 200, test: (p) => p.best >= 200 },
];

/** Achievements newly satisfied by `p` that aren't already unlocked. */
export function newlyUnlocked(p: HoopsProgress): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !p.achievements.includes(a.id) && a.test(p));
}
