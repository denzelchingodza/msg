"use client";

import { useEffect, useRef, useState } from "react";
import Concourse from "@/components/Concourse";
import PhotoHero from "@/components/PhotoHero";
import { api } from "@/lib/api";

interface Beat {
  era: string;
  title: string;
  text: string;
}
interface Faith {
  title: string;
  subtitle: string;
  beats: Beat[];
}

/** Full, uncropped photos placed where they belong in the story. */
const PHOTO_AFTER: Record<string, { src: string; caption: string }> = {
  "1946": {
    src: "/photos/knicks_1946_vintage.jpg",
    caption: "New York basketball. Since 1946.",
  },
  "1951": {
    src: "/photos/vintage_knicks_tickets.jpg",
    caption: "Vintage Garden ducats. The heartbreak started early.",
  },
  "1968": {
    src: "/photos/willis_reed.jpg",
    caption: "Willis Reed. The Captain who set the standard.",
  },
  "1970": {
    src: "/photos/reed_19_brunson_11.jpg",
    caption: "Number 19 walked so number 11 could dance",
  },
  "1971": {
    src: "/photos/earl_the_pearl_monroe.jpg",
    caption: "Earl the Pearl. Half of the Rolls Royce Backcourt.",
  },
  "1973": {
    src: "/photos/three_titles_1970_1973_2026.jpg",
    caption: "Two banners in the rafters. The third was 53 years away.",
  },
  "1984": {
    src: "/photos/bernard_king.jpg",
    caption: "Bernard King. The most electric scorer alive.",
  },
  "1985": {
    src: "/photos/ewing_vs_bird_1986.jpg",
    caption: "Ewing goes right at Bird's Celtics. The Franchise has arrived.",
  },
  "1993": {
    src: "/photos/ewing_and_jordan.jpg",
    caption: "Ewing and Jordan at center court. The Garden was the battlefield.",
  },
  "1994": {
    src: "/photos/nineties_knicks_poster.jpg",
    caption: "Oakley, Ewing, Starks. The most feared team alive.",
  },
  "1996": {
    src: "/photos/starks_and_ewing.jpg",
    caption: "Starks and Ewing. Every night, they made you earn it.",
  },
  "1999": {
    src: "/photos/ewing_over_the_pacers.jpg",
    caption: "Ewing over the Pacers. The endless war for the East.",
  },
  "2000s": {
    src: "/photos/ewing_athletics_shoes.jpg",
    caption: "Even the sneakers were legendary. Ewing Athletics, forever old school.",
  },
  "2011": {
    src: "/photos/melo_garden_erupts.jpg",
    caption: "Melo time. The Garden on its feet.",
  },
  "2012": {
    src: "/photos/spike_lee_courtside.jpg",
    caption: "Spike Lee courtside. The faith never once left the building.",
  },
  "2013": {
    src: "/photos/melo_anthony.jpg",
    caption: "Carmelo and J.R. Smith. The team that took the division.",
  },
  "2017": {
    src: "/photos/retro_phil_jackson.jpg",
    caption: "Phil Jackson's Garden. The long dark had arrived.",
  },
  "2021": {
    src: "/photos/thank_you_fans_new_york_forever.jpg",
    caption: "Thank you fans. New York forever.",
  },
  "2022": {
    src: "/photos/brunson_at_the_garden.jpg",
    caption: "Jalen Brunson. The quiet signing that changed everything.",
  },
  "2025": {
    src: "/photos/mcbride_and_towns.jpg",
    caption: "Towns and McBride. The roster reshaped for one more push.",
  },
  "Jan 2026": {
    src: "/photos/new_york_or_nowhere.jpg",
    caption: "New York or Nowhere. The city showed up anyway.",
  },
  "June 2026": {
    src: "/photos/down_29_comeback.jpg",
    caption: "How do you ever quit after a comeback from down 29 in the Finals?",
  },
  Forever: {
    src: "/photos/new_yorker_cover_2026.jpg",
    caption: "The New Yorker, June 2026. Every legend, behind the captain who finished it.",
  },
};

export default function FaithPage() {
  const [faith, setFaith] = useState<Faith | null>(null);
  const [offline, setOffline] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<Faith>("/api/faith")
      .then(setFaith)
      .catch(() => setOffline(true));
  }, []);

  useEffect(() => {
    if (!faith || !listRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    listRef.current
      .querySelectorAll(".beat, .faith-photo")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [faith]);

  // Scroll-spy: which era is currently in view (drives the rail highlight).
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (!faith) return;
    const els = faith.beats
      .map((_, i) => document.getElementById(`era-${i}`))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveIdx(Number((e.target as HTMLElement).dataset.idx));
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [faith]);

  const jump = (i: number) =>
    document.getElementById(`era-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="page">
      <p className="kicker">The Faith</p>
      <h1 className="page-title">Why We&rsquo;re Like This</h1>
      <p className="page-sub">
        {faith?.subtitle ?? "An explainer for the uninitiated."}
      </p>

      <PhotoHero
        src="/photos/garden_watercolor.jpg"
        caption="New York or Nowhere. The Mecca, since 1946."
        maxWidth={1080}
        height={340}
        position="center 30%"
      />

      <p
        style={{
          maxWidth: 720,
          margin: "18px auto 0",
          textAlign: "center",
          color: "var(--silver)",
          lineHeight: 1.7,
          fontSize: 15,
        }}
      >
        Eighty years in one scroll. Two early banners, then fifty three years of
        heartbreak and faith, then everything all at once. This is the whole
        story, era by era, the way it actually felt to live it.
      </p>

      {offline && (
        <div style={{ marginTop: 26 }}>
          <span className="offline">
            Garden offline. Start the backend: <code>./dev.sh</code>
          </span>
        </div>
      )}

      {faith && (
        <nav className="faith-rail" aria-label="Jump through the eras">
          {faith.beats.map((b, i) => (
            <button
              key={b.era + b.title}
              className={`faith-rail-dot ${i === activeIdx ? "on" : ""}`}
              onClick={() => jump(i)}
            >
              <span className="faith-rail-label">{b.era}</span>
            </button>
          ))}
        </nav>
      )}

      <div className="timeline" ref={listRef}>
        {faith?.beats.map((b, i) => (
          <div key={b.era + b.title} id={`era-${i}`} data-idx={i} className="beat-block">
            <div className="beat">
              <div className="era">{b.era}</div>
              <div className="body">
                <h2>{b.title}</h2>
                <p>{b.text}</p>
              </div>
            </div>
            {PHOTO_AFTER[b.era] && (
              <figure className="faith-photo beat" style={{ display: "block" }}>
                <img
                  src={PHOTO_AFTER[b.era].src}
                  alt={PHOTO_AFTER[b.era].caption}
                />
                <figcaption>{PHOTO_AFTER[b.era].caption}</figcaption>
              </figure>
            )}
          </div>
        ))}
      </div>

      {faith && (
        <div className="center" style={{ marginTop: 30 }}>
          <p
            className="display"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "var(--gold)" }}
          >
            Bing bong. Forever.
          </p>
          <a
            href="/championship"
            className="btn"
            style={{ marginTop: 22, display: "inline-block" }}
          >
            Now go see the parade
          </a>
        </div>
      )}

      <Concourse />
    </main>
  );
}
