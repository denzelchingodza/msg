"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function caption(name: string) {
  return name
    .replace(/\.[a-z]+$/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Auto-advancing photo slideshow of the Garden gallery. */
export default function GardenGallery() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [i, setI] = useState(0);
  const hover = useRef(false);

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((d) => setPhotos(Array.isArray(d.photos) ? d.photos : []))
      .catch(() => {});
  }, []);

  const next = useCallback(() => setI((n) => (photos.length ? (n + 1) % photos.length : 0)), [photos.length]);
  const prev = () => setI((n) => (photos.length ? (n - 1 + photos.length) % photos.length : 0));

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => { if (!hover.current) next(); }, 4200);
    return () => clearInterval(id);
  }, [photos.length, next]);

  if (photos.length === 0) return null;

  return (
    <section className="home-block">
      <p className="home-eyebrow">The Garden gallery</p>
      <div
        className="gallery"
        onMouseEnter={() => (hover.current = true)}
        onMouseLeave={() => (hover.current = false)}
      >
        <img key={photos[i]} src={`/photos/${photos[i]}`} alt="" className="gallery-img" />
        <div className="gallery-cap">{caption(photos[i])}</div>
        <button className="gallery-nav prev" onClick={prev} aria-label="Previous photo">‹</button>
        <button className="gallery-nav next" onClick={next} aria-label="Next photo">›</button>
        <div className="gallery-count">{i + 1} / {photos.length}</div>
      </div>
    </section>
  );
}
