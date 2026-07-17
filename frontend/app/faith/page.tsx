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
  "2021": {
    src: "/photos/thank_you_fans_new_york_forever.jpg",
    caption: "Thank you fans. New York forever.",
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

      {offline && (
        <div style={{ marginTop: 26 }}>
          <span className="offline">
            Garden offline. Start the backend: <code>./dev.sh</code>
          </span>
        </div>
      )}

      <div className="timeline" ref={listRef}>
        {faith?.beats.map((b) => (
          <div key={b.era + b.title}>
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
