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
  { id: "sniper", name: "Dead Eye", desc: "100 lifetime PERFECT swishes", icon: "🎯", reward: 220, test: (p) => p.perfects >= 100 },
  { id: "combo", name: "Combo King", desc: "Hit an 8-shot streak", icon: "🔥", reward: 80, test: (p) => p.bestStreak >= 8 },
  { id: "combo15", name: "On Fire", desc: "Hit a 15-shot streak", icon: "🔥", reward: 160, test: (p) => p.bestStreak >= 15 },
  { id: "combo25", name: "Unconscious", desc: "Hit a 25-shot streak", icon: "🔥", reward: 320, test: (p) => p.bestStreak >= 25 },
  { id: "century", name: "Century", desc: "Score 100 in a game", icon: "💯", reward: 100, test: (p) => p.best >= 100 },
  { id: "legend", name: "Garden Legend", desc: "Score 200 in a game", icon: "👑", reward: 200, test: (p) => p.best >= 200 },
  { id: "unreal", name: "Video Game Numbers", desc: "Score 300 in a game", icon: "👑", reward: 400, test: (p) => p.best >= 300 },
  { id: "grinder", name: "Gym Rat", desc: "Play 10 games", icon: "⛹️", reward: 50, test: (p) => p.games >= 10 },
  { id: "grinder50", name: "Regular", desc: "Play 50 games", icon: "⛹️", reward: 180, test: (p) => p.games >= 50 },
  { id: "grinder150", name: "Season Ticket", desc: "Play 150 games", icon: "⛹️", reward: 500, test: (p) => p.games >= 150 },
  { id: "level5", name: "Rising Star", desc: "Reach level 5", icon: "⭐", reward: 80, test: (p) => levelFromXp(p.xp).level >= 5 },
  { id: "level15", name: "All-Star", desc: "Reach level 15", icon: "⭐", reward: 250, test: (p) => levelFromXp(p.xp).level >= 15 },
  { id: "level30", name: "Hall of Fame", desc: "Reach level 30", icon: "⭐", reward: 600, test: (p) => levelFromXp(p.xp).level >= 30 },
  { id: "collector", name: "Collector", desc: "Own 3 basketballs", icon: "🧺", reward: 70, test: (p) => p.ownedBalls.length >= 3 },
  { id: "collector8", name: "Ball Hog", desc: "Own 8 basketballs", icon: "🧺", reward: 260, test: (p) => p.ownedBalls.length >= 8 },
  { id: "decorator", name: "Home Court", desc: "Own 3 court themes", icon: "🏟️", reward: 200, test: (p) => (p.ownedCourts?.length ?? 1) >= 3 },
  { id: "grand", name: "Bucket Farm", desc: "Bank 500 lifetime points", icon: "🪙", reward: 60, test: (p) => p.totalPoints >= 500 },
  { id: "grand5k", name: "Point Machine", desc: "Bank 5,000 lifetime points", icon: "🪙", reward: 220, test: (p) => p.totalPoints >= 5000 },
  { id: "grand20k", name: "Points Tycoon", desc: "Bank 20,000 lifetime points", icon: "🪙", reward: 650, test: (p) => p.totalPoints >= 20000 },
];

/** Achievements newly satisfied by `p` that aren't already unlocked. */
export function newlyUnlocked(p: HoopsProgress): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !p.achievements.includes(a.id) && a.test(p));
}
