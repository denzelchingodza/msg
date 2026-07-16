"use client";

/**
 * Perspective half-court floor (SVG): real hardwood look with converging wood
 * planks, plus clean NBA markings — baseline, sidelines, painted key,
 * free-throw line + circle, restricted-area arc, a three-point line (corner
 * segments + arc), and the half-court line + center circle.
 */
export default function CourtFloor() {
  const planks = Array.from({ length: 13 }, (_, i) => {
    const xb = (i / 12) * 1000;
    const xt = 500 + (xb - 500) * 0.42;
    return <line key={i} x1={xb} y1="620" x2={xt} y2="40" />;
  });

  const lines = (
    <>
      <path d="M330 30 L670 30" />
      <path d="M330 30 L60 612" />
      <path d="M670 30 L940 612" />
      <path d="M462 30 A 40 13 0 0 0 538 30" />
      <path d="M452 30 L408 300 L592 300 L548 30" />
      <ellipse cx="500" cy="300" rx="92" ry="26" />
      <path d="M306 30 L300 150" />
      <path d="M694 30 L700 150" />
      <path d="M300 150 C 298 402 702 402 700 150" />
      <path d="M74 600 L926 600" />
      <ellipse cx="500" cy="600" rx="100" ry="24" />
    </>
  );

  return (
    <div className="hoops-court-floor" aria-hidden="true">
      <svg viewBox="0 0 1000 620" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b3f1d" />
            <stop offset="55%" stopColor="#a4652e" />
            <stop offset="100%" stopColor="#c98443" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="620" fill="url(#wood)" />

        {/* converging wood planks */}
        <g stroke="#3a1f0c" strokeOpacity="0.16" strokeWidth="1.5">{planks}</g>
        {/* subtle sheen band */}
        <path d="M0 300 L1000 300" stroke="#ffd9a8" strokeOpacity="0.06" strokeWidth="60" />

        {/* painted key fill */}
        <path d="M452 30 L408 300 L592 300 L548 30 Z" fill="#0a2e63" fillOpacity="0.24" />

        {/* dark under-stroke for crispness */}
        <g fill="none" stroke="#231205" strokeOpacity="0.35" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round">{lines}</g>
        {/* white court lines */}
        <g fill="none" stroke="#f7fafe" strokeOpacity="0.88" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round">{lines}</g>
      </svg>
    </div>
  );
}
