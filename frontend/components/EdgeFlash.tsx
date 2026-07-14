"use client";

import { useEffect } from "react";

/**
 * Full-screen edge flash for reactions:
 *   correct → green border burst
 *   wrong   → red border burst + screen shake
 *   roast   → orange border burst + screen shake (Trash Talk)
 * Bump `pulse` (a counter) each event to retrigger. `strong` gives a bigger,
 * rowdier shake — used when roasting the marquee franchises.
 */
export default function EdgeFlash({
  tone,
  pulse,
  strong = false,
}: {
  tone: "correct" | "wrong" | "roast" | null;
  pulse: number;
  strong?: boolean;
}) {
  useEffect(() => {
    if ((tone === "wrong" || tone === "roast") && pulse > 0) {
      const cls = strong ? "screen-shake-strong" : "screen-shake";
      document.body.classList.add(cls);
      const t = setTimeout(
        () => document.body.classList.remove(cls),
        strong ? 650 : 500
      );
      return () => {
        clearTimeout(t);
        document.body.classList.remove(cls);
      };
    }
  }, [tone, pulse, strong]);

  if (!tone) return null;
  return <div key={pulse} className={`edge-flash ${tone}`} aria-hidden="true" />;
}
