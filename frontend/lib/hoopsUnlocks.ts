import { BALLS } from "./hoopsBalls";
import { COURTS } from "./hoopsCourts";
import { HoopsProgress } from "./hoopsStore";

export interface Goal {
  kind: "ball" | "court";
  name: string;
  have: number; // coins toward it (capped at need)
  need: number; // price
}

/** The cheapest thing the player doesn't own yet — the natural next purchase. */
export function nextGoal(p: HoopsProgress): Goal | null {
  const items = [
    ...BALLS.filter((b) => !p.ownedBalls.includes(b.id)).map((b) => ({ kind: "ball" as const, name: b.name, need: b.price })),
    ...COURTS.filter((c) => !p.ownedCourts.includes(c.id)).map((c) => ({ kind: "court" as const, name: c.name, need: c.price })),
  ]
    .filter((i) => i.need > 0)
    .sort((a, b) => a.need - b.need);
  const item = items[0];
  if (!item) return null;
  return { kind: item.kind, name: item.name, have: Math.min(p.coins, item.need), need: item.need };
}
