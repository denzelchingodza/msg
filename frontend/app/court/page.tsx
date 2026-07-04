"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Profile, syncProfile } from "@/lib/api";
import { SECTIONS } from "@/lib/sections";

const ZONES = [
  { href: "/roulette", n: "01", title: "Fact Roulette", x: 50, y: 50 },
  { href: "/gauntlet", n: "02", title: "The Gauntlet", x: 15, y: 50 },
  { href: "/ragebait", n: "03", title: "Rage Bait", x: 85, y: 50 },
  { href: "/trashtalk", n: "04", title: "Trash Talk", x: 17, y: 13 },
  { href: "/championship", n: "05", title: "Chip '26", x: 83, y: 13 },
  { href: "/faith", n: "06", title: "The Faith", x: 50, y: 88 },
] as const;

const CLYDE = [
  "dishing and swishing",
  "posting and toasting",
  "wheeling and dealing",
  "styling and profiling",
  "shaking and baking",
  "hustling and bustling",
  "swooping and hooping",
];

/* Opening night, next season. The night banner number three goes up. */
const BANNER_NIGHT = new Date("2026-10-20T19:30:00-04:00");

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tampered, setTampered] = useState(false);
  const [offline, setOffline] = useState(false);
  const [clyde, setClyde] = useState("");
  const daysToBanner = Math.max(
    0,
    Math.ceil((BANNER_NIGHT.getTime() - Date.now()) / 86_400_000)
  );

  useEffect(() => {
    setClyde(CLYDE[Math.floor(Math.random() * CLYDE.length)]);
  }, []);

  useEffect(() => {
    syncProfile()
      .then((r) => {
        setProfile(r.profile);
        setTampered(r.tampered);
      })
      .catch(() => setOffline(true));
  }, []);

  const welcome = tampered
    ? "Your profile looked... edited. Reset. Real fans don't cheat."
    : profile && profile.day_streak > 1
      ? `Day ${profile.day_streak} streak. The Garden missed you.`
      : "Doors are open. Grab your seat.";

  return (
    <main className="page">
      
      <section className="hero-stage">
        <p className="kicker" style={{ color: "var(--gold)" }}>
          Welcome to the Garden
        </p>
        <h1>MSG</h1>
        <div className="hero-badges">
          <span className="hot">🏆 2026 NBA Champions</span>
          <span>First title in 53 years</span>
          <span>Est. 1946</span>
        </div>
        <p className="hero-welcome" style={{ color: "#e7eefb" }}>
          A place to hang out in Knicks heaven. Spin facts, run trivia, roast
          all 29 other fanbases, relive the parade.
        </p>
        <div className="cta-row">
          <Link href="/roulette" className="btn-ticket">
            Spin a fact
          </Link>
          <Link href="/championship" className="btn-ticket alt">
            Relive the chip
          </Link>
        </div>
        <div>
          <button
            className="sound-pill"
            onClick={() => window.dispatchEvent(new Event("msg:sound"))}
          >
            🔊 Turn the crowd on
          </button>
        </div>
        <p className="muted" style={{ marginTop: 16 }}>
          {offline ? "Garden offline. Start the backend with ./dev.sh" : welcome}
          {clyde && !offline && (
            <>
              {" "}
              Clyde says tonight calls for some{" "}
              <span className="gold">{clyde}</span>.
            </>
          )}
        </p>
      </section>

      <p className="court-label">The Finals floor. Every zone is a door.</p>
      <div className="court-wrap">
        <img
          className="court-img"
          src="/court.jpg"
          alt="Madison Square Garden 2026 NBA Finals court"
        />
        {ZONES.map((z) => (
          <Link
            key={z.href}
            href={z.href}
            className="zone"
            data-n={z.n}
            style={{ left: `${z.x}%`, top: `${z.y}%` }}
          >
            <b>{z.title}</b>
          </Link>
        ))}
      </div>

      <p className="court-label" style={{ marginTop: 44 }}>
        Tonight&rsquo;s lineup
      </p>
      <div className="lineup stagger">
        {SECTIONS.map((f) => (
          <Link key={f.href} href={f.href}>
            <img className="ln-thumb" src={f.thumb} alt="" aria-hidden="true" />
            <span className="ln-num">{f.n}</span>
            <span className="ln-body">
              <b>{f.title}</b>
              <small>{f.does}</small>
            </span>
            <span className="ln-verb">{f.verb} →</span>
          </Link>
        ))}
      </div>

      {profile && (
        <div className="scoreboard">
          <div className="stat">
            <b>{daysToBanner}</b>
            <span>days to banner night</span>
          </div>
          <div className="stat">
            <b>{profile.day_streak}</b>
            <span>day streak</span>
          </div>
          <div className="stat">
            <b>{profile.total_facts}</b>
            <span>facts revealed</span>
          </div>
          <div className="stat">
            <b>{profile.rare_pulls}</b>
            <span>rare pulls</span>
          </div>
          <div className="stat">
            <b>{profile.best_quiz}/10</b>
            <span>{profile.best_quiz_rank.toLowerCase()}</span>
          </div>
          <div className="stat">
            <b>{profile.takes_generated}</b>
            <span>war crimes</span>
          </div>
        </div>
      )}
    </main>
  );
}
