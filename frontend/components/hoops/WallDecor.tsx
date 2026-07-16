"use client";

/**
 * Decorative items hung on the gym wall behind the hoop — a framed jersey, a
 * gold trophy, and a sneaker. Pure SVG, non-interactive, sits on the wall layer
 * (below the hoop). Lower items hide on small screens to avoid clutter.
 */
export default function WallDecor() {
  return (
    <div className="hoops-decor" aria-hidden="true">
      {/* fake gym window — upper left */}
      <div className="decor decor-window">
        <svg viewBox="0 0 170 130" width="100%" height="100%">
          <defs>
            <linearGradient id="win-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f2148" />
              <stop offset="60%" stopColor="#1c3c74" />
              <stop offset="100%" stopColor="#3a5f9e" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="164" height="124" rx="5" fill="#241812" stroke="#4a3226" strokeWidth="4" />
          <rect x="10" y="10" width="150" height="110" fill="url(#win-sky)" />
          <circle cx="134" cy="30" r="8" fill="#e8eef7" opacity="0.85" />
          <path d="M10 120 V92 H24 V78 H36 V96 H50 V70 H58 V54 H66 V70 H78 V88 H92 V64 H100 V88 H114 V80 H128 V96 H140 V84 H152 V100 H160 V120 Z" fill="#0a1428" opacity="0.92" />
          <g fill="#f4c651" opacity="0.85">
            <rect x="60" y="60" width="3" height="4" /><rect x="61" y="72" width="3" height="4" />
            <rect x="96" y="70" width="3" height="4" /><rect x="120" y="86" width="3" height="4" /><rect x="40" y="86" width="3" height="4" />
          </g>
          <g stroke="#241812" strokeWidth="5">
            <line x1="85" y1="10" x2="85" y2="120" />
            <line x1="10" y1="65" x2="160" y2="65" />
          </g>
          <path d="M20 110 L60 14 L74 14 L34 110 Z" fill="#ffffff" opacity="0.08" />
          <path d="M44 110 L84 14 L92 14 L52 110 Z" fill="#ffffff" opacity="0.06" />
        </svg>
      </div>

      {/* framed photo — right */}
      <figure className="decor decor-jersey">
        <img src="/photos/IMG_4789.JPG" alt="" />
      </figure>

      {/* trophy — right, lower */}
      <div className="decor decor-trophy">
        <svg viewBox="0 0 90 132" width="100%" height="100%">
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe9a8" /><stop offset="50%" stopColor="#f4c651" /><stop offset="100%" stopColor="#b8892a" />
            </linearGradient>
          </defs>
          <rect x="22" y="114" width="46" height="12" rx="2" fill="url(#gold)" stroke="#8a6416" strokeWidth="1" />
          <rect x="30" y="102" width="30" height="12" rx="2" fill="url(#gold)" />
          <path d="M40 102 L36 76 L54 76 L50 102 Z" fill="url(#gold)" />
          <circle cx="45" cy="48" r="30" fill="url(#gold)" stroke="#8a6416" strokeWidth="1" />
          <g stroke="#8a6416" strokeWidth="1.4" fill="none" opacity="0.7">
            <path d="M45 18 V78 M15 48 H75 M24 26 Q45 48 24 70 M66 26 Q45 48 66 70" />
          </g>
          <ellipse cx="36" cy="38" rx="8" ry="5" fill="#ffffff" opacity="0.4" />
        </svg>
      </div>

      {/* spray-paint on the wall */}
      <div className="decor decor-graffiti">
        <svg viewBox="0 0 270 96" width="100%" height="100%">
          <g fontFamily="Impact, 'Arial Black', sans-serif" fontStyle="italic">
            <text x="10" y="46" fontSize="44" fill="#f58426" stroke="#9c4d12" strokeWidth="1" transform="rotate(-5 10 46)">BING</text>
            <text x="66" y="86" fontSize="44" fill="#4b86d6" stroke="#1f5bb0" strokeWidth="1" transform="rotate(-5 66 86)">BONG</text>
          </g>
          <g strokeWidth="3" strokeLinecap="round" opacity="0.9">
            <path d="M30 50 v11" stroke="#f58426" /><path d="M58 50 v15" stroke="#f58426" />
            <path d="M92 88 v10" stroke="#4b86d6" /><path d="M132 88 v8" stroke="#4b86d6" />
          </g>
        </svg>
      </div>

      {/* dumbbells — floor left */}
      <div className="decor decor-dumbbell">
        <svg viewBox="0 0 150 80" width="100%" height="100%">
          <g fill="#2a3340" stroke="#151b24" strokeWidth="2">
            <rect x="20" y="30" width="40" height="8" rx="4" /><rect x="9" y="22" width="13" height="24" rx="3" /><rect x="58" y="22" width="13" height="24" rx="3" />
            <rect x="80" y="46" width="40" height="8" rx="4" /><rect x="69" y="38" width="13" height="24" rx="3" /><rect x="118" y="38" width="13" height="24" rx="3" />
          </g>
          <g fill="#f58426"><circle cx="15" cy="34" r="4" /><circle cx="65" cy="34" r="4" /><circle cx="75" cy="50" r="4" /><circle cx="125" cy="50" r="4" /></g>
        </svg>
      </div>

      {/* barbell — floor right */}
      <div className="decor decor-barbell">
        <svg viewBox="0 0 220 60" width="100%" height="100%">
          <rect x="10" y="26" width="200" height="7" rx="3" fill="#8a929c" stroke="#4a4f57" strokeWidth="1.5" />
          <rect x="34" y="10" width="12" height="40" rx="3" fill="#2a3340" stroke="#151b24" strokeWidth="1.5" />
          <rect x="48" y="14" width="9" height="32" rx="2" fill="#f58426" stroke="#9c4d12" strokeWidth="1.5" />
          <rect x="174" y="10" width="12" height="40" rx="3" fill="#2a3340" stroke="#151b24" strokeWidth="1.5" />
          <rect x="163" y="14" width="9" height="32" rx="2" fill="#f58426" stroke="#9c4d12" strokeWidth="1.5" />
        </svg>
      </div>

      {/* trashcan with trash — floor */}
      <div className="decor decor-trash">
        <svg viewBox="0 0 90 112" width="100%" height="100%">
          <path d="M20 34 L26 102 L64 102 L70 34 Z" fill="#3a4450" stroke="#1c222b" strokeWidth="2" />
          <g stroke="#2a323c" strokeWidth="2"><path d="M34 40 L37 98" /><path d="M45 40 L45 98" /><path d="M56 40 L53 98" /></g>
          <rect x="16" y="26" width="58" height="10" rx="3" fill="#4a5560" stroke="#1c222b" strokeWidth="2" />
          <g fill="#e9edf4" stroke="#b8bec8" strokeWidth="1.2">
            <circle cx="80" cy="100" r="8" /><circle cx="11" cy="102" r="7" /><circle cx="45" cy="20" r="7" />
          </g>
        </svg>
      </div>
    </div>
  );
}
