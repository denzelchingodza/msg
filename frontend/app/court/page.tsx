"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FactTeaser from "@/components/home/FactTeaser";
import GardenGallery from "@/components/home/GardenGallery";
import PlaySpotlight from "@/components/home/PlaySpotlight";
import { Profile, syncProfile } from "@/lib/api";
import { SECTIONS, Section } from "@/lib/sections";

const GAMES = ["/roulette", "/gauntlet", "/buzzer", "/hoops", "/ragebait", "/trashtalk"];
const CHIP = new Date("2026-06-13T00:00:00-04:00");
const BANNER_NIGHT = new Date("2026-10-20T19:30:00-04:00");

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [offline, setOffline] = useState(false);

  const daysChamps = Math.max(0, Math.floor((Date.now() - CHIP.getTime()) / 86_400_000));
  const daysToBanner = Math.max(0, Math.ceil((BANNER_NIGHT.getTime() - Date.now()) / 86_400_000));

  useEffect(() => {
    syncProfile()
      .then((r) => setProfile(r.profile))
      .catch(() => setOffline(true));
  }, []);

  const games = SECTIONS.filter((s) => GAMES.includes(s.href));
  const story = SECTIONS.filter((s) => !GAMES.includes(s.href));

  const card = (s: Section) => (
    <Link key={s.href} href={s.href} className="feat-card">
      <div className="feat-thumb" style={{ backgroundImage: `url(${s.thumb})` }} />
      <div className="feat-body">
        <b>{s.title}</b>
        <small>{s.does}</small>
        <span className="feat-verb">{s.verb}</span>
      </div>
    </Link>
  );

  return (
    <main className="page home">
      <section className="home-hero">
        <p className="kicker" style={{ color: "var(--gold)" }}>Welcome to the Garden</p>
        <h1 className="home-mark">MSG</h1>
        <div className="home-badges">
          <span className="hot">2026 NBA Champions</span>
          <span>{daysChamps} days as champions</span>
          <span>Est. 1946</span>
        </div>
        <p className="home-welcome">
          A place to live in Knicks heaven — play the games, spin the facts, roast
          every rival, and relive the parade.
        </p>
        <div className="home-cta">
          <Link href="/hoops" className="btn">Play MSG Hoops</Link>
          <Link href="/championship" className="btn btn-ghost">Relive the chip</Link>
        </div>
        <button className="sound-pill" onClick={() => window.dispatchEvent(new Event("msg:sound"))}>
          Turn the crowd on
        </button>
        {offline && (
          <p className="muted" style={{ marginTop: 14 }}>
            Garden offline. Start the backend with <code>./dev.sh</code>
          </p>
        )}
      </section>

      <PlaySpotlight />
      <FactTeaser />

      <p className="home-eyebrow center">Step onto the court</p>
      <div className="home-grid">{games.map(card)}</div>

      <p className="home-eyebrow center">The story</p>
      <div className="home-grid two">{story.map(card)}</div>

      <GardenGallery />

      {profile && (
        <div className="scoreboard">
          <div className="stat"><b>{daysToBanner}</b><span>days to banner night</span></div>
          <div className="stat"><b>{profile.day_streak}</b><span>day streak</span></div>
          <div className="stat"><b>{profile.total_facts}</b><span>facts revealed</span></div>
          <div className="stat"><b>{profile.rare_pulls}</b><span>rare pulls</span></div>
          <div className="stat"><b>{profile.best_quiz}/10</b><span>{profile.best_quiz_rank.toLowerCase()}</span></div>
          <div className="stat"><b>{profile.takes_generated}</b><span>war crimes</span></div>
        </div>
      )}
    </main>
  );
}
