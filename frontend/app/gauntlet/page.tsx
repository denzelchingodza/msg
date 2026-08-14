"use client";

import { useEffect, useState } from "react";
import Concourse from "@/components/Concourse";
import EdgeFlash from "@/components/EdgeFlash";
import { api, Profile, syncProfile } from "@/lib/api";
import { celebrate } from "@/lib/celebrate";

interface Question {
  q: string;
  options: string[];
  correct: number;
  why: string;
  cat: string;
}
interface Run {
  questions: Question[];
  praise: string[];
  roast: string[];
  ranks: { min: number; title: string }[];
}

const LETTERS = "ABCD";
const SHOT_CLOCK = 24;

const CATS: Record<string, string> = {
  chip26: "The '26 chip",
  history: "Deep history",
  fanbase: "Fanbase lore",
  shade: "Premium shade",
};

export default function Gauntlet() {
  const [run, setRun] = useState<Run | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);
  const [clock, setClock] = useState(SHOT_CLOCK);
  const [offline, setOffline] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [flashTone, setFlashTone] = useState<"correct" | "wrong" | null>(null);
  const [flashPulse, setFlashPulse] = useState(0);

  useEffect(() => {
    syncProfile()
      .then((r) => setProfile(r.profile))
      .catch(() => setOffline(true));
  }, []);

  /* The shot clock. 24 seconds, same as the pros. */
  useEffect(() => {
    if (!run || done || picked !== null) return;
    setClock(SHOT_CLOCK);
    const id = setInterval(() => {
      setClock((c) => {
        if (c <= 0.2) {
          clearInterval(id);
          setPicked(-1);
          setStreak(0);
          setFeedback("SHOT CLOCK VIOLATION. That's a turnover.");
          return 0;
        }
        return c - 0.2;
      });
    }, 200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, idx, done, picked === null]);

  async function start() {
    try {
      const r = await api<Run>("/api/quiz/run");
      setOffline(false);
      setRun(r);
      setIdx(0);
      setScore(0);
      setStreak(0);
      setPicked(null);
      setDone(false);
    } catch {
      setOffline(true);
    }
  }

  function rankFor(s: number): string {
    if (!run) return "";
    let title = run.ranks[0].title;
    for (const r of run.ranks) if (s * 3 >= r.min) title = r.title;
    return title;
  }

  function answer(i: number) {
    if (!run || picked !== null) return;
    const q = run.questions[idx];
    setPicked(i);
    setFlashTone(i === q.correct ? "correct" : "wrong");
    setFlashPulse((p) => p + 1);
    if (i === q.correct) {
      const ns = streak + 1;
      setScore((s) => s + 1);
      setStreak(ns);
      setFeedback(run.praise[Math.floor(Math.random() * run.praise.length)]);
      if (ns >= 5) celebrate(true);
    } else {
      setStreak(0);
      setFeedback(run.roast[Math.floor(Math.random() * run.roast.length)]);
    }
  }

  async function next() {
    if (!run) return;
    if (idx + 1 >= run.questions.length) {
      setDone(true);
      if (profile && score > profile.best_quiz) celebrate(true);
      try {
        const { profile: p } = await syncProfile("quiz_best", score);
        setProfile(p);
      } catch {}
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  }

  if (!run) {
    return (
      <main className="page center">
        <p className="kicker">The Gauntlet</p>
        <h1 className="page-title">10 Questions. 24 Seconds Each.</h1>
        <p className="page-sub">
          The &rsquo;26 chip, deep history, fanbase lore, and premium shade.
          The shot clock is real. Wrong answers get roasted.
        </p>
        <div
          className="stage-card"
          style={{
            maxWidth: 820,
            backgroundImage: "url(/photos/comeback_kids_june_13.jpg)",
          }}
        >
          {offline ? (
            <span className="offline">
              Garden offline. Start the backend: <code>./dev.sh</code>
            </span>
          ) : (
            <div>
              <p className="stage-title">TONIGHT&rsquo;S TEST OF FAITH</p>
              <div className="rule-chips">
                <span>10 questions</span>
                <span>24 second shot clock</span>
                <span>wrong answers get roasted</span>
              </div>
              {profile && (
                <p className="stage-note gold">
                  Your best: {profile.best_quiz}/10 · {profile.best_quiz_rank}
                </p>
              )}
              <p className="stage-note">
                Ranks climb from Tourist at the Garden to Banner Raiser.
              </p>
            </div>
          )}
        </div>
        <button className="btn" onClick={start}>
          Enter the Gauntlet
        </button>
        <Concourse />
      </main>
    );
  }

  if (done) {
    return (
      <main className="page center">
        <p className="kicker">Final buzzer</p>
        <h1 className="page-title" style={{ fontSize: 96 }}>
          {score}/{run.questions.length}
        </h1>
        <div style={{ marginTop: 10 }}>
          <span className="badge" style={{ fontSize: 15, padding: "10px 26px" }}>
            RANK: {rankFor(score)}
          </span>
        </div>
        {profile && (
          <p className="muted" style={{ marginTop: 18 }}>
            lifetime best: {profile.best_quiz}/10 ({profile.best_quiz_rank})
          </p>
        )}
        <div style={{ marginTop: 30 }}>
          <button className="btn" onClick={start}>
            Run it back
          </button>
        </div>
        <Concourse />
      </main>
    );
  }

  const q = run.questions[idx];
  return (
    <main className="page">
      <EdgeFlash tone={flashTone} pulse={flashPulse} />
      <div className="qhead">
        <div>
          <span className="lbl">Question</span>
          <span className="led">
            {idx + 1}/{run.questions.length}
          </span>
        </div>
        <div>
          <span className="lbl">Score</span>
          <span className="led">{score}</span>
        </div>
        <div>
          <span className="lbl">Streak</span>
          <span className="led">{streak}</span>
        </div>
        <div className={`shotclock ${clock <= 5 ? "danger" : ""}`}>
          <b>{Math.ceil(clock)}</b>
          <span className="lbl">shot clock</span>
        </div>
      </div>
      <div className="progress">
        {run.questions.map((_, i) => (
          <i key={i} className={i <= idx ? "done" : ""} />
        ))}
      </div>

      <div className="jumbotron swap" key={q.q}>
        <span className="q-cat">{CATS[q.cat] ?? q.cat}</span>
        <p className="big-quote" style={{ margin: "10px 0 0" }}>
          {q.q}
        </p>
        <div className="clock-bar">
          <i style={{ width: `${(clock / SHOT_CLOCK) * 100}%` }} />
        </div>
      </div>

      <div className="stagger" key={`opts-${idx}`} style={{ display: "grid", gap: 12 }}>
        {q.options.map((opt, i) => {
          let cls = "option";
          if (picked !== null) {
            if (i === q.correct) cls += " correct";
            else if (i === picked) cls += " wrong";
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={picked !== null}
              onClick={() => answer(i)}
            >
              <span className="letter">{LETTERS[i]}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="center swap" style={{ marginTop: 26 }}>
          <p
            className="kicker"
            style={{ color: picked === q.correct ? "var(--gold)" : "var(--red)" }}
          >
            {feedback}
          </p>
          <p className="muted" style={{ margin: "12px auto 18px", maxWidth: 640 }}>
            {q.why}
          </p>
          <button className="btn btn-ghost" onClick={next}>
            {idx + 1 >= run.questions.length ? "Final score" : "Next question"}
          </button>
        </div>
      )}
    </main>
  );
}
