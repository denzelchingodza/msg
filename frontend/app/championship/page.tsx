"use client";

import { useEffect, useState } from "react";
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

  return (
    <main className="page center">
      <p className="kicker">Championship &rsquo;26</p>
      <h1 className="page-title">The Drought Is Dead</h1>

      <div className="banners-row" aria-label="Championship banners">
        <div className="bannerflag">
          1970<small>CHAMPIONS</small>
        </div>
        <div className="bannerflag">
          1973<small>CHAMPIONS</small>
        </div>
        <div className="bannerflag new">
          2026<small>CHAMPIONS</small>
        </div>
      </div>

      <div className="trio">
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
          src="/photos/brunson_and_the_larry_obrien.jpg"
          alt="Jalen Brunson holding the Larry O'Brien trophy at the parade"
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
          <div
            key={idx}
            className="card card-hot swap"
            style={{
              maxWidth: 880,
              margin: "16px auto 0",
              minHeight: 210,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setIdx((i) => (i + 1) % story.length)}
            role="button"
            tabIndex={0}
          >
            <div>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="big-quote" style={{ fontWeight: 400 }}>
                {slide.text}
              </p>
            </div>
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

      {zoom && (
        <figure className="lightbox" onClick={() => setZoom(null)}>
          <img src={`/photos/${zoom}`} alt={caption(zoom)} />
          <figcaption>{caption(zoom)} · tap anywhere to close</figcaption>
        </figure>
      )}

      <Concourse />
    </main>
  );
}
