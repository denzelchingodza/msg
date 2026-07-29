/** Player titles: prestige nicknames earned by reaching a level. Free to equip
 * once the level is met — they are the reward for leveling up. */
export interface Title {
  id: string;
  name: string;
  level: number; // level required to unlock
}

export const TITLES: Title[] = [
  { id: "rookie", name: "Rookie", level: 1 },
  { id: "sixthman", name: "Sixth Man", level: 3 },
  { id: "starter", name: "Starter", level: 5 },
  { id: "bucket", name: "Bucket Getter", level: 8 },
  { id: "sniper", name: "Sniper", level: 11 },
  { id: "allstar", name: "All-Star", level: 15 },
  { id: "franchise", name: "Franchise", level: 20 },
  { id: "mvp", name: "Garden MVP", level: 26 },
  { id: "legend", name: "Garden Legend", level: 33 },
  { id: "goat", name: "The GOAT", level: 42 },
];

export const titleById = (id: string): Title =>
  TITLES.find((t) => t.id === id) ?? TITLES[0];

/** Titles unlocked at or below the given level. */
export const unlockedTitles = (level: number) =>
  TITLES.filter((t) => level >= t.level);
