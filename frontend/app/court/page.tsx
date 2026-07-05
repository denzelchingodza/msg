"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Profile, syncProfile } from "@/lib/api";
import { SECTIONS } from "@/lib/sections";

/* Placed on the real spots in the bowl: quiz on the jumbotron,
   history up in the banners, facts down on the floor. */
const ZONES = [
  { href: "/roulette", n: "01", title: "Fact Roulette", x: 50, y: 68 },
  { href: "/gauntlet", n: "02", title: "The Gauntlet", x: 50, y: 38 },
  { href: "/ragebait", n: "03", title: "Rage Bait", x: 15, y: 50 },
  { href: "/trashtalk", n: "04", title: "Trash Talk", x: 85, y: 50 },
  { href: "/faith", n: "05", title: "The Faith", x: 25, y: 12 },
  { href: "/championship", n: "06", title: "Chip '26", x: 75, y: 12 },
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
      
      <section
        className="hero-stage"
        style={{ backgroundImage: "url(/photos/parade_in_watercolor.jpg)" }}
      >
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

      <p className="court-label">The Garden, from the 400s. Every light is a door.</p>
      <div className="court-wrap" style={{ maxWidth: 840 }}>
        <img
          className="court-img"
          src="/placed/home_arena.jpg"
          alt="Madison Square Garden bowl with championship banners"
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

      <div className="home-duo">
        <figure className="duo-card">
          <img src="/placed/squad_huddle.webp" alt="The 2026 Knicks huddle" />
          <figcaption>
            <b>THE FAMILY</b>
            <span>your 2026 champions, mid huddle</span>
          </figcaption>
        </figure>
        <figure className="duo-card">
          <img src="/placed/splash_poster.jpg" alt="New York Knicks splash art" />
          <figcaption>
            <b>THE COLORS</b>
            <span>blue and orange, forever</span>
          </figcaption>
        </figure>
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
