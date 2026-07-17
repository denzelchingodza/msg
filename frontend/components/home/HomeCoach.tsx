"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Tip {
  title: string;
  text: string;
  cta?: { label: string; href: string };
}

/** Contextual tips keyed to each home section (via data-coach attributes). */
const TIPS: Record<string, Tip> = {
  hero: { title: "Welcome", text: "Welcome to the Mecca. Scroll on down to see everything inside." },
  featured: { title: "The main event", text: "MSG Hoops is the flagship game. Flick the ball and race a rival.", cta: { label: "Play now", href: "/hoops" } },
  games: { title: "More to play", text: "Trivia, roasts, hot takes, and facts. Tap any card to jump in." },
  story: { title: "The story", text: "The Faith is the whole journey, from 1946 all the way to the parade.", cta: { label: "Read it", href: "/faith" } },
  gallery: { title: "The gallery", text: "Every championship photo, on a loop. Soak it in." },
};

function Ball() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6C10 9 10 15 5.6 18.4M18.4 5.6C14 9 14 15 18.4 18.4" />
    </svg>
  );
}

export default function HomeCoach() {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef(0);

  // Pick the section most in view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-coach]"));
    if (!els.length) return;
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = (e.target as HTMLElement).dataset.coach!;
          ratios.set(id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        let best = els[0].dataset.coach!;
        let bestR = -1;
        els.forEach((el) => {
          const id = el.dataset.coach!;
          const r = ratios.get(id) ?? 0;
          if (r > bestR) { bestR = r; best = id; }
        });
        setActive(best);
        activeElRef.current = els.find((el) => el.dataset.coach === best) ?? null;
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keep the bubble beside the active section as you scroll.
  const reposition = useCallback(() => {
    const el = activeElRef.current;
    const bubble = bubbleRef.current;
    if (!el || !bubble || mobile) return;
    const r = el.getBoundingClientRect();
    const bh = bubble.offsetHeight;
    const vh = window.innerHeight;
    let top = r.top + Math.min(r.height, vh) / 2 - bh / 2;
    top = Math.max(74, Math.min(vh - bh - 20, top));
    bubble.style.top = `${top}px`;
  }, [mobile]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(reposition);
    };
    const onResize = () => { setMobile(window.innerWidth < 680); reposition(); };
    setMobile(window.innerWidth < 680);
    reposition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reposition]);

  useEffect(() => { reposition(); }, [active, open, reposition]);

  if (!open) {
    return (
      <button className="coach-fab" onClick={() => setOpen(true)} aria-label="Show the Garden guide">
        <Ball />
      </button>
    );
  }

  const tip = TIPS[active] ?? TIPS.hero;
  return (
    <div ref={bubbleRef} className={`coach ${mobile ? "coach-mobile" : ""}`} role="status" aria-live="polite">
      <div className="coach-av"><Ball /></div>
      <div className="coach-body">
        <div className="coach-head">
          <b>{tip.title}</b>
          <button className="coach-x" onClick={() => setOpen(false)} aria-label="Hide the guide">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <p key={active} className="coach-text">{tip.text}</p>
        {tip.cta && (
          <div className="coach-foot">
            <Link href={tip.cta.href} className="coach-cta">{tip.cta.label}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
