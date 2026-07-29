/** Equippable perks (loadout): buy once with coins, equip ONE at a time. The
 * active perk applies at the start of every game. Kept to effects that don't
 * touch shot physics so the core feel stays consistent. */
export interface Perk {
  id: string;
  name: string;
  desc: string;
  price: number;
  extraTime: number; // seconds added to the round
  coinMult: number; // coin multiplier for the game
  xpMult: number; // xp multiplier for the game
  startStreak: number; // combo streak you begin the game with
}

export const NO_PERK: Perk = {
  id: "none",
  name: "No perk",
  desc: "Play it straight, no boosts.",
  price: 0,
  extraTime: 0,
  coinMult: 1,
  xpMult: 1,
  startStreak: 0,
};

export const PERKS: Perk[] = [
  { id: "overtime", name: "Overtime", desc: "Start with +15 seconds on the clock.", price: 350, extraTime: 15, coinMult: 1, xpMult: 1, startStreak: 0 },
  { id: "hotstart", name: "Hot Start", desc: "Tip off already on a x2 combo.", price: 400, extraTime: 0, coinMult: 1, xpMult: 1, startStreak: 3 },
  { id: "coinrush", name: "Coin Rush", desc: "Earn double coins all game.", price: 550, extraTime: 0, coinMult: 2, xpMult: 1, startStreak: 0 },
  { id: "doublexp", name: "Double XP", desc: "Earn double XP all game.", price: 550, extraTime: 0, coinMult: 1, xpMult: 2, startStreak: 0 },
  { id: "allgas", name: "All Gas", desc: "+10s, and open on a x2 combo.", price: 900, extraTime: 10, coinMult: 1, xpMult: 1, startStreak: 3 },
];

export const perkById = (id: string): Perk =>
  id === "none" ? NO_PERK : PERKS.find((p) => p.id === id) ?? NO_PERK;
