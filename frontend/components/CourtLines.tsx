/** Chalk-drawn full court, top-down. Pure lines, no fills. */
export default function CourtLines({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 940 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="currentColor" strokeWidth={strokeWidth}>
        {/* floor boundary */}
        <rect x="20" y="20" width="900" height="460" rx="6" />
        {/* half-court */}
        <line x1="470" y1="20" x2="470" y2="480" />
        <circle cx="470" cy="250" r="64" />
        <circle cx="470" cy="250" r="10" stroke="var(--orange)" />
        {/* left key */}
        <rect x="20" y="175" width="172" height="150" />
        <circle cx="192" cy="250" r="56" />
        <path d="M20 74 L84 74 A 214 214 0 0 1 84 426 L20 426" />
        {/* left rim + backboard */}
        <line x1="52" y1="212" x2="52" y2="288" />
        <circle cx="66" cy="250" r="9" stroke="var(--orange)" />
        {/* right key */}
        <rect x="748" y="175" width="172" height="150" />
        <circle cx="748" cy="250" r="56" />
        <path d="M920 74 L856 74 A 214 214 0 0 0 856 426 L920 426" />
        {/* right rim + backboard */}
        <line x1="888" y1="212" x2="888" y2="288" />
        <circle cx="874" cy="250" r="9" stroke="var(--orange)" />
      </g>
    </svg>
  );
}
