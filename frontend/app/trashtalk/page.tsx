"use client";

import { useEffect, useState } from "react";
import Concourse from "@/components/Concourse";
import EdgeFlash from "@/components/EdgeFlash";
import { api } from "@/lib/api";
import { celebrate } from "@/lib/celebrate";

// The marquee franchises — roasting these rattles the whole building.
const BIG_DOGS = ["Celtics", "Lakers", "Nets", "Heat", "Bulls", "Warriors", "76ers", "Bucks"];

interface TeamMeta {
  name: string;
  nickname: string;
  abbr: string;
  conf: "East" | "West";
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
  const [flashPulse, setFlashPulse] = useState(0);
  const [flashStrong, setFlashStrong] = useState(false);

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
      setFlashStrong(BIG_DOGS.some((n) => teams[teamIdx]?.name.includes(n)));
      setFlashPulse((p) => p + 1);
      celebrate(false);
    } catch {
      setOffline(true);
    } finally {
      setBusy(false);
    }
  }

  const grid = (conf: "East" | "West") => (
    <div className="conf-col">
      <h3>{conf}ern Conference</h3>
      <div className="teams-grid">
        {teams.map((t, i) =>
          t.conf === conf ? (
            <button
              key={t.abbr}
              className={`team-tile ${i === sel ? "picked" : ""}`}
              onClick={() => fire(i)}
              title={`${t.name}, aka ${t.nickname}`}
            >
              {t.abbr}
              <small>{t.name.split(" ").pop()}</small>
            </button>
          ) : null
        )}
      </div>
    </div>
  );

  return (
    <main className="page compact center">
      <EdgeFlash tone={flashPulse > 0 ? "roast" : null} pulse={flashPulse} strong={flashStrong} />
      <p className="kicker">Trash Talk Generator</p>
      <h1 className="page-title">The League Report Card</h1>
      <p className="page-sub">
        East on the left, West on the right, champions in the middle. Tap a
        team and the talking starts. Franchises and stars both get it.
      </p>

      {offline && (
        <div style={{ margin: "20px 0" }}>
          <span className="offline">
            Garden offline. Start the backend: <code>./dev.sh</code>
          </span>
        </div>
      )}

      {teams.length > 0 && (
        <div className="conf-layout">
          {grid("East")}
          <div className="champ-crest">
            <span className="crest-nyk">NYK</span>
            <span className="crest-sub">New York Knicks</span>
            <img
              className="crest-img"
              src="/placed/knicks_in_4.jpg"
              alt="Lady Liberty in a Knicks jersey saying shush"
            />
            <span className="crest-sub">🏆 2026 NBA Champions</span>
            <p className="crest-note">
              Not listed below because the view is better from up here.
            </p>
          </div>
          {grid("West")}
        </div>
      )}

      {line && (
        <div
          key={line.line}
          className="card card-hot ticket swap"
          style={{ maxWidth: 860, margin: "22px auto 0", padding: "26px 34px" }}
        >
          <p className="kicker">
            {line.team}, aka &ldquo;{line.nickname}&rdquo;
          </p>
          <p className="big-quote" style={{ margin: "14px 0" }}>
            {line.line}
          </p>
          <p className="gold cond" style={{ fontSize: 16 }}>
            {line.closer}
          </p>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 16, padding: "12px 30px", fontSize: 14 }}
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
