"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Tip {
  text: string;
  cta?: { label: string; href: string };
}

/** Navigation tips the guide rotates through on the home page. */
const TIPS: Tip[] = [
  { text: "Welcome to the Mecca. Scroll down to see everything inside." },
  { text: "MSG Hoops is the main event. Flick the ball and race the clock.", cta: { label: "Play", href: "/hoops" } },
  { text: "Beat the Buzzer: rapid fire trivia against sixty seconds.", cta: { label: "Play", href: "/buzzer" } },
  { text: "The Gauntlet: ten questions, a real shot clock, no mercy.", cta: { label: "Play", href: "/gauntlet" } },
  { text: "Fact Roulette: one button, eighty years of Knicks facts.", cta: { label: "Spin", href: "/roulette" } },
  { text: "Trash Talk: pick any rival in the league and get your ammo.", cta: { label: "Fire", href: "/trashtalk" } },
  { text: "Rage Bait: hot takes built to end the group chat.", cta: { label: "Generate", href: "/ragebait" } },
  { text: "The Faith: the whole story, 1946 all the way to the parade.", cta: { label: "Read", href: "/faith" } },
  { text: "Championship '26: relive the run and the Canyon of Heroes.", cta: { label: "Relive", href: "/championship" } },
];

function Ball() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6C10 9 10 15 5.6 18.4M18.4 5.6C14 9 14 15 18.4 18.4" />
    </svg>
  );
}

export default function HomeCoach() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setI((n) => (n + 1) % TIPS.length), 7000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) {
    return (
      <button className="coach-fab" onClick={() => setOpen(true)} aria-label="Show the Garden guide">
        <Ball />
      </button>
    );
  }

  const tip = TIPS[i];
  return (
    <div className="coach" role="status" aria-live="polite">
      <div className="coach-av"><Ball /></div>
      <div className="coach-body">
        <div className="coach-head">
          <b>Your Garden guide</b>
          <button className="coach-x" onClick={() => setOpen(false)} aria-label="Hide the guide">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <p key={i} className="coach-text">{tip.text}</p>
        <div className="coach-foot">
          {tip.cta ? (
            <Link href={tip.cta.href} className="coach-cta">{tip.cta.label}</Link>
          ) : (
            <span />
          )}
          <button className="coach-next" onClick={() => setI((n) => (n + 1) % TIPS.length)}>
            Next
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
