"use client";

import { useEffect } from "react";
import { tap } from "@/lib/tactile";

/** Global tactile feedback: fires a light haptic + soft tick on any press of an
 * interactive element. One capture-phase listener, no per-component wiring. */
const SELECTOR = 'button, [role="button"], a.btn, .feat, .team-tile, .option';

export default function Tactile() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest(SELECTOR) as HTMLElement | null;
      if (!el) return;
      if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") return;
      tap();
    };
    window.addEventListener("pointerdown", onDown, true);
    return () => window.removeEventListener("pointerdown", onDown, true);
  }, []);
  return null;
}
