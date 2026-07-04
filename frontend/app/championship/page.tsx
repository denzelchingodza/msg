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

const caption = (name: string) =>
  name.replace(/\.[^.]+$/, "").replace(/_/g, " ").toUpperCase();

export default function Championship() {
  const [story, setStory] = useState<Story[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

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

      <div className="trio">
        <div>
          <b>53</b>
          <span>years of waiting</span>
        </div>
        <div>
          <b>5</b>
          <span>finals games</span>
        </div>
        <div>
          <b>1</b>
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

      {slide && (
        <>
          <p className="court-label">The run, game by game. Click to advance.</p>
          <div
            key={idx}
            className="card card-hot swap"
            style={{
              maxWidth: 880,
              margin: "16px auto 0",
              minHeight: 230,
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
          <div className="dots">
            {story.map((_, i) => (
              <i
                key={i}
                className={i === idx ? "on" : ""}
                onClick={() => setIdx(i)}
              />
            ))}
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
