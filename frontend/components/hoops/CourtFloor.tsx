"use client";

/**
 * Perspective half-court floor (SVG). Hardwood plus clean, clearly-drawn NBA
 * markings: baseline, sidelines, the painted key, free-throw line + circle, the
 * restricted-area arc, a three-point line (corner segments + arc) that stays
 * inside the sidelines and clear of the key, and the half-court line + center
 * circle. Lines are crisp: a soft dark under-stroke gives contrast, bright white
 * on top.
 */
export default function CourtFloor() {
  const lines = (
    <>
      {/* baseline + sidelines */}
      <path d="M330 26 L670 26" />
      <path d="M330 26 L70 614" />
      <path d="M670 26 L930 614" />
      {/* restricted area under the rim */}
      <path d="M462 26 A 40 13 0 0 0 538 26" />
      {/* painted key + free-throw line and circle */}
      <path d="M452 26 L408 300 L592 300 L548 26" />
      <ellipse cx="500" cy="300" rx="92" ry="26" />
      {/* three-point line: corner segments + arc */}
      <path d="M306 26 L300 150" />
      <path d="M694 26 L700 150" />
      <path d="M300 150 C 298 402 702 402 700 150" />
      {/* half-court line + center circle */}
      <path d="M72 600 L928 600" />
      <ellipse cx="500" cy="600" rx="100" ry="24" />
    </>
  );

  return (
    <div className="hoops-court-floor" aria-hidden="true">
      <svg viewBox="0 0 1000 620" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6f421f" />
            <stop offset="55%" stopColor="#a4652e" />
            <stop offset="100%" stopColor="#c37f39" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="620" fill="url(#wood)" />

        {/* faint plank shading */}
        <g stroke="#000000" strokeOpacity="0.09" strokeWidth="2">
          <line x1="0" y1="210" x2="1000" y2="210" />
          <line x1="0" y1="410" x2="1000" y2="410" />
        </g>

        {/* painted key fill */}
        <path d="M452 26 L408 300 L592 300 L548 26 Z" fill="#0a2e63" fillOpacity="0.22" />

        {/* dark under-stroke for contrast */}
        <g fill="none" stroke="#241206" strokeOpacity="0.35" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round">
          {lines}
        </g>
        {/* crisp white lines */}
        <g fill="none" stroke="#f7fafe" strokeOpacity="0.85" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round">
          {lines}
        </g>
      </svg>
    </div>
  );
}
