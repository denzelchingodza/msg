"use client";

import { useState } from "react";
import Concourse from "@/components/Concourse";
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

      {take ? (
        <div
          key={take.take}
          className="card card-hot ticket swap card-fixed"
          style={{ maxWidth: 840, margin: "30px auto", height: 320 }}
        >
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
        </div>
      ) : (
        <div
          className="stage-card taped"
          style={{
            maxWidth: 840,
            backgroundImage: "url(/photos/champs_front_page.jpg)",
          }}
        >
          <div className="tape">
            <b>CAUTION · CERTIFIED HOT TAKES · HANDLE WITH GLOVES</b>
          </div>
          {offline ? (
            <span className="offline">
              Garden offline. Start the backend: <code>./dev.sh</code>
            </span>
          ) : (
            <div>
              <p className="stage-title">THE MACHINE IS WARM</p>
              <div className="rule-chips">
                <span>40 takes loaded</span>
                <span>rage levels 1 to 5</span>
                <span>no apologies issued</span>
              </div>
              <p className="stage-note">
                Every take is objectively true. Rival fans are simply too
                emotional to accept them.
              </p>
            </div>
          )}
        </div>
      )}

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
