"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Concourse from "@/components/Concourse";
import EdgeFlash from "@/components/EdgeFlash";
import { api } from "@/lib/api";

interface Q {
  q: string;
  options: string[];
  correct: number;
  cat: string;
}

const LETTERS = "ABCD";
const ROUND_SECONDS = 60;

const RANKS: { min: number; title: string }[] = [
  { min: 20, title: "BUZZER BEATER" },
  { min: 15, title: "GARDEN LEGEND" },
  { min: 10, title: "6TH MAN" },
  { min: 5, title: "BENCH MOB" },
  { min: 0, title: "TOURIST AT THE GARDEN" },
];
const rankFor = (s: number) => RANKS.find((r) => s >= r.min)!.title;

export default function Buzzer() {
  const [questions, setQuestions] = useState<Q[]>([]);
  const [offline, setOffline] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [time, setTime] = useState(ROUND_SECONDS);
  const [flashTone, setFlashTone] = useState<"correct" | "wrong" | null>(null);
  const [flashPulse, setFlashPulse] = useState(0);
  const locked = useRef(false);

  const load = useCallback(() => {
    api<{ questions: Q[] }>("/api/buzzer")
      .then((r) => setQuestions(r.questions))
      .catch(() => setOffline(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The clock.
  useEffect(() => {
    if (!started || done) return;
    const id = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(id);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, done]);

  function start() {
    setScore(0);
    setIdx(0);
    setPicked(null);
    setTime(ROUND_SECONDS);
    setDone(false);
    locked.current = false;
    if (questions.length === 0) load();
    setStarted(true);
  }

  function answer(i: number) {
    if (locked.current || done) return;
    locked.current = true;
    setPicked(i);
    const q = questions[idx % questions.length];
    setFlashTone(i === q.correct ? "correct" : "wrong");
    setFlashPulse((p) => p + 1);
    if (i === q.correct) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      setIdx((n) => n + 1);
      locked.current = false;
    }, 300);
  }

  const q = questions.length ? questions[idx % questions.length] : null;

  return (
    <main className="page compact">
      <EdgeFlash tone={flashTone} pulse={flashPulse} />
      <p className="kicker center">Center court · the shot clock is running</p>
      <h1 className="page-title center retro">Beat the Buzzer</h1>
      <p className="page-sub center">
        As many trivia buckets as you can drain in {ROUND_SECONDS} seconds. No
        time to think. Go.
      </p>

      {offline && (
        <p className="offline" style={{ margin: "18px auto", display: "flex" }}>
          Garden offline. Start the backend with <code>./dev.sh</code>
        </p>
      )}

      {/* Start screen */}
      {!started && !offline && (
        <div className="card center" style={{ marginTop: 24 }}>
          <p className="big-quote" style={{ marginBottom: 20 }}>
            60 seconds. One right answer = one bucket. Miss it, no points, keep
            moving. Ready?
          </p>
          <button className="btn" onClick={start} disabled={questions.length === 0}>
            {questions.length === 0 ? "Warming up…" : "Tip it off"}
          </button>
        </div>
      )}

      {/* Live round */}
      {started && !done && q && (
        <>
          <div className="jumbotron" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18 }}>
            <div>
              <span className="q-cat">Buckets</span>
              <div className="led" style={{ fontSize: 30 }}>{score}</div>
            </div>
            <div className={`shotclock ${time <= 10 ? "danger" : ""}`}>
              <b>{time}</b>
              <span className="lbl">seconds</span>
              <div className="clock-bar">
                <i style={{ width: `${(time / ROUND_SECONDS) * 100}%` }} />
              </div>
            </div>
          </div>

          <p className="big-quote" style={{ margin: "6px 0 18px" }}>{q.q}</p>
          <div style={{ display: "grid", gap: 10 }}>
            {q.options.map((opt, i) => {
              const state =
                picked === null
                  ? ""
                  : i === q.correct
                    ? "correct"
                    : i === picked
                      ? "wrong"
                      : "";
              return (
                <button
                  key={i}
                  className={`option ${state}`}
                  onClick={() => answer(i)}
                  disabled={picked !== null}
                >
                  <span className="letter">{LETTERS[i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Final */}
      {done && (
        <div className="card center swap" style={{ marginTop: 24 }}>
          <p className="kicker">Buzzer</p>
          <div className="trio" style={{ justifyContent: "center" }}>
            <div>
              <b>{score}</b>
              <span>buckets in {ROUND_SECONDS}s</span>
            </div>
          </div>
          <p className="page-title" style={{ fontSize: 30, marginTop: 10 }}>
            {rankFor(score)}
          </p>
          <p className="muted" style={{ margin: "14px 0 22px" }}>
            {score >= 15
              ? "The Garden is on its feet. Certified."
              : score >= 8
                ? "Solid run. The 400 level respects it."
                : "Keep shooting. Even Starks missed a few."}
          </p>
          <button className="btn" onClick={start}>
            Run it back
          </button>
        </div>
      )}

      <Concourse />
    </main>
  );
}
