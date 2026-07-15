"use client";

/**
 * A perspective half-court floor in SVG — hardwood plus clean, non-overlapping
 * markings: sidelines, baseline, the painted key, free-throw line + circle, a
 * three-point line (corner segments + arc) that stays inside the sidelines and
 * clear of the key, and the half-court line with center circle.
 */
export default function CourtFloor() {
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
        <g stroke="#000000" strokeOpacity="0.1" strokeWidth="2">
          <line x1="0" y1="200" x2="1000" y2="200" />
          <line x1="0" y1="400" x2="1000" y2="400" />
        </g>

        {/* painted key */}
        <path d="M450 30 L410 290 L590 290 L550 30 Z" fill="#0a2e63" fillOpacity="0.2" />

        <g fill="none" stroke="#f4f7fc" strokeOpacity="0.55" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          {/* sidelines + baseline */}
          <path d="M80 620 L360 30" />
          <path d="M920 620 L640 30" />
          <path d="M360 30 L640 30" />
          {/* key + free-throw line and circle */}
          <path d="M450 30 L410 290 L590 290 L550 30" />
          <ellipse cx="500" cy="290" rx="95" ry="26" />
          {/* three-point line: corner segments + arc */}
          <path d="M310 30 L310 165" />
          <path d="M690 30 L690 165" />
          <path d="M310 165 C290 470 710 470 690 165" />
          {/* half court + center circle */}
          <path d="M78 600 L922 600" />
          <ellipse cx="500" cy="600" rx="104" ry="26" />
        </g>
      </svg>
    </div>
  );
}
