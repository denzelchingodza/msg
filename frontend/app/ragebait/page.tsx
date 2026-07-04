"use client";

import { useState } from "react";
import Concourse from "@/components/Concourse";
import PhotoHero from "@/components/PhotoHero";
import { api, syncProfile } from "@/lib/api";
import { celebrate } from "@/lib/celebrate";

interface Take {
  take: string;
  rage: number;
  target: string;
  hated_by: number;
  next_label: string;
}

export default function RageBait() {
  const [take, setTake] = useState<Take | null>(null);
  const [label, setLabel] = useState("DEPLOY FIRST TAKE");
  const [total, setTotal] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);

  async function generate() {
    if (busy) return;
    setBusy(true);
    try {
      const t = await api<Take>("/api/take");
      setOffline(false);
      setTake(t);
      setLabel(t.next_label);
      if (t.rage >= 5) celebrate(true);
      const { profile } = await syncProfile("take");
      setTotal(profile.takes_generated);
    } catch {
      setOffline(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page compact center">
      <p className="kicker">Rage Bait Machine</p>
      <h1 className="page-title">Objectively True Statements</h1>
      <p className="page-sub">
        Not responsible for lost friendships. Certified true by us.
      </p>

      {!take && !offline && (
        <PhotoHero
          src="/photos/champs_front_page.jpg"
          caption="Champs. Says so in the paper."
          maxWidth={840}
          height={160}
          position="center 25%"
        />
      )}

      <div
        key={take?.take ?? "empty"}
        className="card card-hot ticket swap"
        style={{
          maxWidth: 840,
          margin: "36px auto",
          minHeight: 250,
          display: "grid",
          placeItems: "center",
        }}
      >
        {take ? (
          <div style={{ width: "100%" }}>
            <p className="big-quote">&ldquo;{take.take}&rdquo;</p>
            <p className="kicker" style={{ marginTop: 28 }}>
              Certified rage level: {take.rage}/5
            </p>
            <div className="meter">
              <i style={{ width: `${take.rage * 20}%` }} />
            </div>
            <p className="muted">
              primary victims: {take.target} ·{" "}
              {take.hated_by.toLocaleString()} rival fans hated this
            </p>
          </div>
        ) : offline ? (
          <span className="offline">
            Garden offline. Start the backend: <code>./dev.sh</code>
          </span>
        ) : (
          <p className="muted" style={{ fontSize: 18 }}>
            This machine produces facts other fanbases are too emotional to
            accept.
          </p>
        )}
      </div>

      <button className="btn" onClick={generate} disabled={busy}>
        {label}
      </button>

      {total !== null && (
        <p className="muted" style={{ marginTop: 24 }}>
          war crimes generated (lifetime): {total}
        </p>
      )}
      <Concourse />
    </main>
  );
}
