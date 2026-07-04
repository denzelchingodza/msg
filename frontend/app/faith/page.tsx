"use client";

import { useEffect, useRef, useState } from "react";
import Concourse from "@/components/Concourse";
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
  "1970": {
    src: "/photos/reed_19_brunson_11.jpg",
    caption: "Number 19 walked so number 11 could dance",
  },
  "2021": {
    src: "/photos/thank_you_fans_new_york_forever.jpg",
    caption: "Thank you fans. New York forever.",
  },
  "June 2026": {
    src: "/photos/brunson_and_the_larry_obrien.jpg",
    caption: "The trophy finally came home",
  },
  Forever: {
    src: "/photos/canyon_of_heroes_crowd.jpg",
    caption: "The Canyon of Heroes, June 2026",
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
