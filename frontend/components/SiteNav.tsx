"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SectionPager from "@/components/SectionPager";

export default function SiteNav() {
  const [min, setMin] = useState(false);

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
      <SectionPager />
    </header>
  );
}
