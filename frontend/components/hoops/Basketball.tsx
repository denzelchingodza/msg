"use client";

import { BallSkin } from "@/lib/hoopsBalls";

/**
 * A single reusable basketball. Fills its container (width/height 100%), so the
 * caller controls the size. `gid` must be unique per instance on a page because
 * SVG gradient ids are global.
 */
export default function Basketball({ skin, gid }: { skin: BallSkin; gid: string }) {
  const id = `ball-${gid}`;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={skin.grad[0]} />
          <stop offset="32%" stopColor={skin.grad[1]} />
          <stop offset="78%" stopColor={skin.grad[2]} />
          <stop offset="100%" stopColor={skin.grad[3]} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47.5" fill={`url(#${id})`} stroke={skin.seam} strokeWidth="1.5" />
      <g stroke={skin.seam} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M50 3 V97" />
        <path d="M4 50 H96" />
        <path d="M17 13 Q46 50 17 87" />
        <path d="M83 13 Q54 50 83 87" />
      </g>
      <ellipse cx="35" cy="29" rx="12" ry="7.5" fill="#fff" opacity="0.33" />
    </svg>
  );
}
