"use client";

import Link from "next/link";
import { useEffect } from "react";
import GardenGallery from "@/components/home/GardenGallery";
import SectionIcon from "@/components/home/SectionIcon";
import { syncProfile } from "@/lib/api";
import { SECTIONS, Section } from "@/lib/sections";

const GAMES = ["/roulette", "/gauntlet", "/buzzer", "/ragebait", "/trashtalk"];

export default function Home() {
  useEffect(() => { syncProfile().catch(() => {}); }, []);

  // Reveal sections as they scroll into view.
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const games = SECTIONS.filter((s) => GAMES.includes(s.href));
  const story = SECTIONS.filter((s) => !GAMES.includes(s.href) && s.href !== "/hoops");

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
          <p className="home-eyebrow center hero-sub">The Mecca, in app form</p>
          <h1 className="home-mark">
            <span style={{ animationDelay: "0.05s" }}>M</span>
            <span style={{ animationDelay: "0.18s" }}>S</span>
            <span style={{ animationDelay: "0.31s" }}>G</span>
          </h1>
          <p className="hero-welcome-line">Welcome to the Garden</p>
          <p className="hero-desc">
            The Mecca in your pocket. MSG is a living New York Knicks shrine where
            you play the games, spin the facts, roast every rival, and relive the
            2026 championship. All the joy of being a fan, in one place.
          </p>
        </div>
        <a href="#inside" className="home-scroll" aria-label="Scroll to explore">
          Scroll
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </a>
      </section>

      <Link href="/hoops" className="hero-play reveal" id="inside">
        <img className="hero-play-img" src="/photos/rising_at_the_rim.jpg" alt="" />
        <div className="hero-play-body">
          <span className="hero-play-tag">Featured game</span>
          <b>MSG Hoops</b>
          <small>Flick to shoot. A 60-second race against a rival, streaks, bonus targets, and a rim that moves when you get hot.</small>
          <span className="hero-play-cta">Play now</span>
        </div>
      </Link>

      <p className="home-eyebrow center reveal">More to play</p>
      <div className="feat-grid reveal">{games.map(card)}</div>

      <p className="home-eyebrow center reveal">The story</p>
      <div className="feat-grid two reveal">{story.map(card)}</div>

      <div className="reveal"><GardenGallery /></div>
    </main>
  );
}
