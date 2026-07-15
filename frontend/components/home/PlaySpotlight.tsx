"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/sections";

/** A rotating "play now" spotlight over the featured games. */
const FEATURED = SECTIONS.filter((s) =>
  ["/hoops", "/gauntlet", "/buzzer", "/roulette", "/trashtalk"].includes(s.href)
);

export default function PlaySpotlight() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % FEATURED.length), 4500);
    return () => clearInterval(id);
  }, []);

  const s = FEATURED[i];
  return (
    <section className="home-block">
      <p className="home-eyebrow">Play now</p>
      <Link key={s.href} href={s.href} className="spotlight" style={{ backgroundImage: `url(${s.thumb})` }}>
        <div className="spotlight-body">
          <b>{s.title}</b>
          <small>{s.does}</small>
          <span className="spotlight-cta">{s.verb}</span>
        </div>
      </Link>
      <div className="spotlight-dots">
        {FEATURED.map((f, k) => (
          <button key={f.href} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={f.title} />
        ))}
      </div>
    </section>
  );
}
