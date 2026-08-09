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
