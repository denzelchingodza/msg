"use client";

/**
 * Decorative items hung on the gym wall behind the hoop — a framed jersey, a
 * gold trophy, and a sneaker. Pure SVG, non-interactive, sits on the wall layer
 * (below the hoop). Lower items hide on small screens to avoid clutter.
 */
export default function WallDecor() {
  return (
    <div className="hoops-decor" aria-hidden="true">
      {/* framed jersey — right */}
      <div className="decor decor-jersey">
        <svg viewBox="0 0 110 132" width="100%" height="100%">
          <rect x="2" y="2" width="106" height="128" rx="4" fill="#3a2a18" />
          <rect x="8" y="8" width="94" height="116" fill="#e9edf4" />
          <path d="M40 24 L28 34 L20 52 L30 60 L34 52 L34 108 L76 108 L76 52 L80 60 L90 52 L82 34 L70 24 Q55 34 40 24 Z" fill="#0a58b0" stroke="#063a7a" strokeWidth="1.5" />
          <path d="M40 24 Q55 34 70 24" fill="none" stroke="#f58426" strokeWidth="3" />
          <text x="55" y="90" textAnchor="middle" fontFamily="Arial Black, Impact, sans-serif" fontSize="34" fill="#ffffff">11</text>
        </svg>
      </div>

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
