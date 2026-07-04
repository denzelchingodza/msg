"use client";

import { useEffect, useState } from "react";
import Concourse from "@/components/Concourse";
import { api } from "@/lib/api";
import { celebrate } from "@/lib/celebrate";

interface TeamMeta {
  name: string;
  nickname: string;
  abbr: string;
}
interface Line {
  team: string;
  nickname: string;
  line: string;
  closer: string;
}

export default function TrashTalk() {
  const [teams, setTeams] = useState<TeamMeta[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [line, setLine] = useState<Line | null>(null);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    api<{ teams: TeamMeta[] }>("/api/trash/teams")
      .then((r) => {
        setTeams(r.teams);
        setOffline(false);
      })
      .catch(() => setOffline(true));
  }, []);

  async function fire(teamIdx: number) {
    if (busy) return;
    setBusy(true);
    setSel(teamIdx);
    try {
      const l = await api<Line>(`/api/trash/${teamIdx}`);
      setLine(l);
      celebrate(false);
    } catch {
      setOffline(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page compact center">
      <p className="kicker">Trash Talk Generator</p>
      <h1 className="page-title">All 29 Victims Available</h1>
      <p className="page-sub">
        Tap a team. The talking starts immediately. All of it is true.
      </p>

      {offline && (
        <div style={{ margin: "20px 0" }}>
          <span className="offline">
            Garden offline. Start the backend: <code>./dev.sh</code>
          </span>
        </div>
      )}

      <div className="teams-grid">
        {teams.map((t, i) => (
          <button
            key={t.abbr}
            className={`team-tile ${i === sel ? "picked" : ""}`}
            onClick={() => fire(i)}
            title={t.name}
          >
            {t.abbr}
            <small>{t.name.split(" ").pop()}</small>
          </button>
        ))}
      </div>

      {line && (
        <div
          key={line.line}
          className="card card-hot ticket swap"
          style={{ maxWidth: 840, margin: "6px auto 0", padding: "28px 34px" }}
        >
          <p className="kicker">
            {line.team}, aka &ldquo;{line.nickname}&rdquo;
          </p>
          <p className="big-quote" style={{ margin: "16px 0" }}>
            {line.line}
          </p>
          <p className="gold cond" style={{ fontSize: 16 }}>
            {line.closer}
          </p>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 18, padding: "12px 30px", fontSize: 14 }}
            onClick={() => sel !== null && fire(sel)}
            disabled={busy}
          >
            Keep talking
          </button>
        </div>
      )}

      <Concourse />
    </main>
  );
}
