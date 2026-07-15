"use client";

/**
 * A perspective half-court floor drawn in SVG — hardwood plus real markings
 * (baseline, painted key, free-throw line + circle, three-point arc, half-court
 * line and center circle). Sits at the bottom of the screen so the hoop reads
 * as mounted over an actual court instead of floating.
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
        <g stroke="#000000" strokeOpacity="0.13" strokeWidth="2">
          <line x1="0" y1="150" x2="1000" y2="150" />
          <line x1="0" y1="300" x2="1000" y2="300" />
          <line x1="0" y1="450" x2="1000" y2="450" />
        </g>

        {/* painted key tint */}
        <path d="M430 24 L392 300 L608 300 L570 24 Z" fill="#0a2e63" fillOpacity="0.22" />

        {/* court lines */}
        <g fill="none" stroke="#f4f7fc" strokeOpacity="0.6" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          <path d="M60 620 L330 24" />
          <path d="M940 620 L670 24" />
          <path d="M330 24 L670 24" />
          <path d="M78 600 L922 600" />
          <ellipse cx="500" cy="600" rx="104" ry="26" />
          <path d="M430 24 L392 300 L608 300 L570 24" />
          <ellipse cx="500" cy="300" rx="112" ry="30" />
          <path d="M215 24 C150 250 340 452 500 452 C660 452 850 250 785 24" />
        </g>
      </svg>
    </div>
  );
}
