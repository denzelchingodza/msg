"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GardenGallery from "@/components/home/GardenGallery";
import SectionIcon from "@/components/home/SectionIcon";
import { syncProfile } from "@/lib/api";
import { SECTIONS, Section } from "@/lib/sections";

const GAMES = ["/roulette", "/gauntlet", "/buzzer", "/hoops", "/ragebait", "/trashtalk"];
const CHIP = new Date("2026-06-13T00:00:00-04:00");

export default function Home() {
  const [offline, setOffline] = useState(false);
  const daysChamps = Math.max(0, Math.floor((Date.now() - CHIP.getTime()) / 86_400_000));

  useEffect(() => {
    syncProfile().catch(() => setOffline(true));
  }, []);

  const games = SECTIONS.filter((s) => GAMES.includes(s.href));
  const story = SECTIONS.filter((s) => !GAMES.includes(s.href));

  const card = (s: Section) => (
    <Link key={s.href} href={s.href} className="feat">
      <span className="feat-ico"><SectionIcon href={s.href} /></span>
      <span className="feat-txt">
        <b>{s.title}</b>
        <small>{s.does}</small>
      </span>
    </Link>
  );

  return (
    <main className="page home">
      <section className="home-hero">
        <div className="home-hero-inner">
          <p className="home-eyebrow center" style={{ color: "var(--gold)", marginBottom: 18 }}>
            The Mecca, in app form
          </p>
          <h1 className="home-mark">MSG</h1>
          <p className="home-hook">
            Knicks heaven, on demand. Play the games, spin the facts, roast every
            rival, and relive the <b>2026 championship</b>.
          </p>
          <div className="home-badges">
            <span className="hot">2026 NBA Champions</span>
            <span>{daysChamps} days as champions</span>
            <span>Est. 1946</span>
          </div>
          <div className="home-cta">
            <Link href="/hoops" className="btn">Play MSG Hoops</Link>
            <a href="#inside" className="btn btn-ghost">See what&rsquo;s inside</a>
          </div>
          <button className="sound-pill" onClick={() => window.dispatchEvent(new Event("msg:sound"))}>
            Turn the crowd on
          </button>
        </div>
        <div className="home-scroll" aria-hidden="true">Scroll to explore</div>
      </section>

      {offline && (
        <p className="muted center" style={{ marginTop: 24 }}>
          Garden offline. Start the backend with <code>./dev.sh</code>
        </p>
      )}

      <p id="inside" className="home-eyebrow center">Step onto the court</p>
      <div className="feat-grid">{games.map(card)}</div>

      <p className="home-eyebrow center">The story</p>
      <div className="feat-grid two">{story.map(card)}</div>

      <GardenGallery />
    </main>
  );
}
