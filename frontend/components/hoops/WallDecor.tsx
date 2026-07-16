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

      {/* sneaker — left, lower */}
      <div className="decor decor-shoe">
        <svg viewBox="0 0 150 96" width="100%" height="100%">
          <path d="M8 78 Q4 92 20 92 L128 92 Q140 92 138 80 L138 74 L10 74 Z" fill="#f58426" stroke="#9c4d12" strokeWidth="1.5" />
          <path d="M10 74 L138 74" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
          <path d="M14 74 L14 40 Q14 22 40 20 L70 18 L96 30 L120 40 Q136 46 136 62 L136 74 Z" fill="#0a58b0" stroke="#063a7a" strokeWidth="1.5" />
          <path d="M96 30 L120 40 Q136 46 136 62 L108 60 Q98 44 96 30 Z" fill="#0d4a96" />
          <g stroke="#e8eef7" strokeWidth="3" strokeLinecap="round"><path d="M52 34 L70 30 M56 44 L74 40 M60 54 L78 50" /></g>
          <path d="M60 66 Q90 50 128 60" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}
