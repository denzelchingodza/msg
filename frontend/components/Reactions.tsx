"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * "Facts / Cap" reactions with a live-feeling tally. Each take/line gets a
 * deterministic baseline crowd (seeded from its text, so it feels like a real
 * vote and stays stable), and the user's own vote nudges it. Votes persist in
 * localStorage. Purely on-device — no backend needed.
 */

const KEY = "msg_reactions";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function loadVotes(): Record<string, "facts" | "cap"> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function saveVotes(v: Record<string, "facts" | "cap">) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* private mode */
  }
}

export default function Reactions({ id }: { id: string }) {
  const base = useMemo(() => {
    const h = hash(id);
    const factsPct = 58 + (h % 35); // 58..92 — these takes lean "true"
    const total = 400 + (h % 5200); // seeded crowd size
    const factsCount = Math.round((total * factsPct) / 100);
    return { total, factsCount };
  }, [id]);

  const [vote, setVote] = useState<"facts" | "cap" | null>(null);
  useEffect(() => {
    setVote(loadVotes()[id] ?? null);
  }, [id]);

  const facts = base.factsCount + (vote === "facts" ? 1 : 0);
  const cap = base.total - base.factsCount + (vote === "cap" ? 1 : 0);
  const total = facts + cap;
  const factsPct = Math.round((facts / total) * 100);

  const cast = (v: "facts" | "cap") => {
    const votes = loadVotes();
    votes[id] = v;
    saveVotes(votes);
    setVote(v);
  };

  return (
    <div className="react">
      <div className="react-btns">
        <button
          className={`react-btn facts ${vote === "facts" ? "on" : ""}`}
          onClick={() => cast("facts")}
          aria-pressed={vote === "facts"}
        >
          Facts <b key={factsPct}>{factsPct}%</b>
        </button>
        <button
          className={`react-btn cap ${vote === "cap" ? "on" : ""}`}
          onClick={() => cast("cap")}
          aria-pressed={vote === "cap"}
        >
          Cap <b key={100 - factsPct}>{100 - factsPct}%</b>
        </button>
      </div>
      <div className="react-bar" role="presentation">
        <i style={{ width: `${factsPct}%` }} />
      </div>
      <p className="react-tally">
        {total.toLocaleString()} fans weighed in{vote ? " · you're on the record" : ""}
      </p>
    </div>
  );
}
