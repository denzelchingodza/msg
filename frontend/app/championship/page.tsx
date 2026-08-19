"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Concourse from "@/components/Concourse";
import { api } from "@/lib/api";
import { celebrate } from "@/lib/celebrate";

interface Story {
  title: string;
  text: string;
}
interface Gallery {
  story: Story[];
  photo_hint: string;
}

const ART = new Set([
  "parade_in_watercolor.jpg",
  "subway_to_the_title.jpg",
  "rooftop_of_new_york.jpg",
]);

/* One pill per story card: the five Finals games plus the parade. */
const PILLS = [
  { label: "G1 · W", cls: "w" },
  { label: "G2 · W", cls: "w" },
  { label: "G3 · L", cls: "l" },
  { label: "G4 · W 107 106", cls: "w" },
  { label: "G5 · W 94 90", cls: "w" },
  { label: "PARADE", cls: "w" },
];

/* Scoreboard detail per stop on the ride. */
const GAME_META: {
  badge: string;
  cls: "w" | "l";
  venue: string;
  date: string;
  nyk?: number;
  sas?: number;
  note?: string;
  photo?: string;
  photoCaption?: string;
}[] = [
  { badge: "WIN", cls: "w", venue: "MSG", date: "June 3" },
  { badge: "WIN", cls: "w", venue: "MSG", date: "June 5" },
  { badge: "LOSS", cls: "l", venue: "San Antonio", date: "June 8" },
  { badge: "WIN", cls: "w", venue: "San Antonio", date: "June 11", nyk: 107, sas: 106 },
  {
    badge: "CHAMPS",
    cls: "w",
    venue: "San Antonio",
    date: "June 13",
    nyk: 94,
    sas: 90,
    note: "Brunson 45 · ties Jordan",
    photo: "/placed/mitch_23.jpg",
    photoCaption: "Mitch: 10 boards nobody will ever forget",
  },
  { badge: "PARADE", cls: "w", venue: "Canyon of Heroes", date: "Lower Broadway" },
];

const caption = (name: string) =>
  name.replace(/\.[^.]+$/, "").replace(/_/g, " ").toUpperCase();

function useCountUp(target: number, ms = 1300) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export default function Championship() {
  const [story, setStory] = useState<Story[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const years = useCountUp(53);
  const games = useCountUp(5);
  const parades = useCountUp(1);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("msg:track", { detail: "knicks" }));
    return () => {
      window.dispatchEvent(new CustomEvent("msg:track", { detail: "garden" }));
    };
  }, []);

  useEffect(() => {
    celebrate(true);
    api<Gallery>("/api/gallery")
      .then((g) => setStory(g.story))
      .catch(() => setOffline(true));
    fetch("/api/photos")
      .then((r) => (r.ok ? r.json() : { photos: [] }))
      .then((p: { photos: string[] }) => setPhotos(p.photos))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") setZoom(null);
      if (!story.length) return;
      if (e.code === "ArrowRight") setIdx((i) => (i + 1) % story.length);
      if (e.code === "ArrowLeft")
        setIdx((i) => (i - 1 + story.length) % story.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [story.length]);

  const art = photos.filter((p) => ART.has(p));
  const wall = photos.filter((p) => !ART.has(p));
  const slide = story[idx];
  const meta = GAME_META[Math.min(idx, GAME_META.length - 1)];
  const finalsUpto = idx >= 5 ? 5 : idx + 1;
  const nykWins = GAME_META.slice(0, finalsUpto).filter((g) => g.cls === "w").length;
  const sasWins = GAME_META.slice(0, finalsUpto).filter((g) => g.cls === "l").length;

  return (
    <main className="page center">
      <p className="kicker">Championship &rsquo;26</p>
      <h1 className="page-title">The Drought Is Dead</h1>

      <div
        className="rafters"
        aria-label="Championship banners in the Garden rafters"
      >
        <span className="rafter-beam" aria-hidden="true" />
        {[
          { year: "1970", cls: "" },
          { year: "1973", cls: "" },
          { year: "2026", cls: "b-new" },
        ].map((b) => (
          <div className={`banner-hang ${b.cls}`} key={b.year}>
            <span className="banner-cord" aria-hidden="true" />
            <div className="banner">
              <span className="banner-team">New York</span>
              <span className="banner-year">{b.year}</span>
              <span className="banner-label">NBA Champions</span>
            </div>
          </div>
        ))}
      </div>

      <div className="trio chip-trio">
        <div>
          <b>{years}</b>
          <span>years of waiting</span>
        </div>
        <div>
          <b>{games}</b>
          <span>finals games</span>
        </div>
        <div>
          <b>{parades}</b>
          <span>parade</span>
        </div>
      </div>

      {offline && (
        <div style={{ margin: "18px 0" }}>
          <span className="offline">
            Garden offline. Start the backend: <code>./dev.sh</code>
          </span>
        </div>
      )}

      <figure className="chip-hero">
        <img
          src="/photos/trophy_over_broadway.jpg"
          alt="Jalen Brunson lifting the Larry O'Brien trophy over the New York skyline"
          style={{ objectPosition: "center 20%" }}
        />
        <figcaption>The trophy came home</figcaption>
      </figure>

      {slide && (
        <>
          <div className="score-strip">
            {PILLS.slice(0, story.length).map((p, i) => (
              <button
                key={p.label}
                className={`score-pill ${p.cls} ${i === idx ? "on" : ""}`}
                onClick={() => setIdx(i)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="game-stage">
            <button
              className="game-arrow"
              aria-label="Previous game"
              onClick={() =>
                setIdx((i) => (i - 1 + story.length) % story.length)
              }
            >
              ←
            </button>
            <div
              key={idx}
              className="card card-hot swap game-card"
              onClick={() => setIdx((i) => (i + 1) % story.length)}
              role="button"
              tabIndex={0}
            >
              {meta.badge === "PARADE" ? (
                <div className="gscore gscore-parade">
                  <span className="gs-badge w">PARADE</span>
                  <span className="gs-meta">
                    {meta.venue} &middot; Champions {nykWins}&ndash;{sasWins}
                  </span>
                </div>
              ) : (
                <div className="gscore">
                  <div className="gs-team nyk">
                    <span className="gs-abbr">NYK</span>
                    {meta.nyk != null && (
                      <span className="gs-pts">{meta.nyk}</span>
                    )}
                  </div>
                  <div className="gs-mid">
                    <span className={`gs-badge ${meta.cls}`}>{meta.badge}</span>
                    <span className="gs-meta">
                      {meta.venue} &middot; {meta.date}
                    </span>
                    <span className="gs-series">
                      Series {nykWins}&ndash;{sasWins}
                    </span>
                  </div>
                  <div className="gs-team sas">
                    <span className="gs-abbr">SAS</span>
                    {meta.sas != null && (
                      <span className="gs-pts">{meta.sas}</span>
                    )}
                  </div>
                </div>
              )}
              <h2 className="slide-title">{slide.title}</h2>
              <p className="big-quote" style={{ fontWeight: 400 }}>
                {slide.text}
              </p>
              {meta.note && <p className="gs-note">{meta.note}</p>}
              {meta.photo && (
                <figure className="game-photo">
                  <img src={meta.photo} alt={meta.photoCaption ?? ""} />
                  <figcaption>{meta.photoCaption}</figcaption>
                </figure>
              )}
              <div className="game-dots" aria-hidden="true">
                {story.map((_, i) => (
                  <span key={i} className={i === idx ? "on" : ""} />
                ))}
              </div>
            </div>
            <button
              className="game-arrow"
              aria-label="Next game"
              onClick={() => setIdx((i) => (i + 1) % story.length)}
            >
              →
            </button>
          </div>
        </>
      )}

      {art.length > 0 && (
        <>
          <p className="court-label" style={{ marginTop: 46 }}>
            The chip, as art
          </p>
          <div className="art-strip">
            {art.map((name) => (
              <figure key={name}>
                <img
                  src={`/photos/${name}`}
                  alt={caption(name)}
                  onClick={() => setZoom(name)}
                />
                <figcaption>{caption(name)}</figcaption>
              </figure>
            ))}
          </div>
        </>
      )}

      {wall.length > 0 && (
        <>
          <p className="court-label" style={{ marginTop: 46 }}>
            The wall. Tap any photo to see it full.
          </p>
          <div className="mosaic">
            {wall.map((name) => (
              <img
                key={name}
                src={`/photos/${name}`}
                alt={caption(name)}
                loading="lazy"
                onClick={() => setZoom(name)}
              />
            ))}
          </div>
        </>
      )}

      {zoom && typeof document !== "undefined" &&
        createPortal(
          <figure className="lightbox" onClick={() => setZoom(null)}>
            <img src={`/photos/${zoom}`} alt={caption(zoom)} />
            <figcaption>{caption(zoom)} · tap anywhere to close</figcaption>
          </figure>,
          document.body
        )}

      <Concourse />
    </main>
  );
}
