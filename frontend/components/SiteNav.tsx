"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GardenAudio from "@/components/GardenAudio";
import GardenTime from "@/components/GardenTime";
import HeaderLocation from "@/components/HeaderLocation";

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
        <span className="nav-mark">MSG</span>
        <span className="nav-dot" aria-hidden="true" />
        <span className="nav-sub">the mecca</span>
      </Link>
      <div className="nav-tools">
        <GardenTime />
        <HeaderLocation />
        <GardenAudio />
      </div>
      <Link href="/court" className="nav-home">
        Home Court
      </Link>
    </header>
  );
}
