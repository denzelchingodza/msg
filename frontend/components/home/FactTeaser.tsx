"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Fact { text: string; rare: boolean; tag: string; }

/** A live Knicks fact pulled from the backend, with a "another" re-roll. */
export default function FactTeaser() {
  const [fact, setFact] = useState<Fact | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api<Fact>("/api/pull")
      .then(setFact)
      .catch(() => setFact(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <section className="home-block">
      <p className="home-eyebrow">From the vault</p>
      <div className={`fact-card ${fact?.rare ? "rare" : ""}`}>
        {fact?.rare && <span className="fact-badge">Rare pull</span>}
        <p className="fact-text">
          {fact ? fact.text : "Pulling a fact from 80 years of Knicks history…"}
        </p>
        {fact && <span className="fact-tag">{fact.tag}</span>}
        <div className="fact-actions">
          <button className="btn" onClick={load} disabled={loading}>Another</button>
          <Link className="btn btn-ghost" href="/roulette">Open Fact Roulette</Link>
        </div>
      </div>
    </section>
  );
}
