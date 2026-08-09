"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GardenAudio from "@/components/GardenAudio";

const LINKS = [
  { href: "/hoops", label: "Hoops" },
  { href: "/faith", label: "The Faith" },
  { href: "/championship", label: "Chip '26" },
];

export default function SiteNav() {
  const [min, setMin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setMin(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${min ? "nav-min" : ""}`}>
      <Link href="/court" className="nav-logo" aria-label="MSG home court">
        <span className="nav-ball" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <circle cx="12" cy="12" r="10.5" fill="#f4951f" stroke="#7a1405" strokeWidth="0.5" />
            <g stroke="#5a2408" strokeWidth="1.1" fill="none" strokeLinecap="round">
              <path d="M12 1.5v21M1.5 12h21M4.8 4.8c4.6 3.2 4.6 11.2 0 14.4M19.2 4.8c-4.6 3.2-4.6 11.2 0 14.4" />
            </g>
          </svg>
        </span>
        <span className="nav-mark">MSG</span>
      </Link>

      <nav className="nav-links">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`nav-link ${pathname === l.href ? "on" : ""}`}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="nav-right">
        <GardenAudio />
        <Link href="/court" className="nav-home">
          Home Court
        </Link>
      </div>
    </header>
  );
}
