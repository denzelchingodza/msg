"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useHoopsLink, type LinkMsg } from "@/lib/hoopsLink";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const CODE_RE = /^[A-HJ-NP-Z2-9]{4,6}$/; // matches makeRoom()'s alphabet

export default function Play({ params }: { params: Promise<{ room: string }> }) {
  const { room } = use(params);
  const code = room.toUpperCase().slice(0, 6);
  const validCode = CODE_RE.test(code);

  const [you, setYou] = useState(0);
  const [rival, setRival] = useState(0);
  const [secs, setSecs] = useState(60);
  const [phase, setPhase] = useState<string>("intro");
  const [flash, setFlash] = useState<"make" | "miss" | null>(null);
  const [power, setPower] = useState(0);
  const [aim, setAim] = useState(0); // -1..1 while aiming
  const [aiming, setAiming] = useState(false);
  const [shooting, setShooting] = useState(false);

  const padRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  const buzz = (ms: number | number[]) => {
    try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
  };

  const onHost = (m: LinkMsg) => {
    if (m.t === "state") {
      setYou(Number(m.you) || 0);
      setRival(Number(m.rival) || 0);
      setSecs(Number(m.secs) || 0);
      setPhase(String(m.phase || "intro"));
    } else if (m.t === "result") {
      const made = Boolean(m.made);
      setFlash(made ? "make" : "miss");
      buzz(made ? (m.perfect ? [12, 40, 12] : 18) : 8);
      setTimeout(() => setFlash(null), 280);
    }
  };

  const { connected, peer, send } = useHoopsLink(
    validCode ? code : null,
    "pad",
    onHost
  );
  const live = connected && peer;

  // If we're connected to the relay but no screen shows up after a while, the
  // code is probably wrong or the game on the big screen was closed. Say so
  // instead of spinning on "Waiting…" forever.
  const [stale, setStale] = useState(false);
  useEffect(() => {
    if (!connected || peer) {
      setStale(false);
      return;
    }
    const t = setTimeout(() => setStale(true), 9000);
    return () => clearTimeout(t);
  }, [connected, peer]);

  const calc = (e: React.PointerEvent) => {
    const r = padRef.current!.getBoundingClientRect();
    const s = start.current!;
    const dx = e.clientX - r.left - s.x;
    const dy = e.clientY - r.top - s.y;
    const powr = dy < 0 ? Math.min(1, -dy / (r.height * 0.42)) : 0;
    const aimX = Math.max(-1, Math.min(1, dx / (r.width * 0.6)));
    return { dx, dy, powr, aimX };
  };

  const down = (e: React.PointerEvent) => {
    if (shooting) return;
    const r = padRef.current!.getBoundingClientRect();
    start.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    setAiming(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
  };
  const move = (e: React.PointerEvent) => {
    if (!start.current) return;
    const { powr, aimX } = calc(e);
    setPower(powr);
    setAim(aimX);
  };
  const up = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    setAiming(false);
    setPower(0);
    if (!s) return;
    const { dy, powr, aimX } = calc(e);
    if (dy > -16) return; // needs a real upward flick
    send({ t: "shoot", power: powr, aimX }); // no-ops if not connected yet
    buzz(14);
    setShooting(true);
    setTimeout(() => setShooting(false), 440);
  };
  const cancel = () => {
    start.current = null;
    setAiming(false);
    setPower(0);
  };

  if (!validCode) {
    return (
      <main className="play play-bad">
        <div className="play-bad-panel">
          <span className="play-mark">MSG HOOPS</span>
          <b>That code isn&apos;t right</b>
          <small>
            Game codes are 4 letters and numbers. Open MSG Hoops on the big
            screen and scan the QR code, or type the code shown there exactly.
          </small>
          <Link className="btn" href="/hoops">
            Open MSG Hoops
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`play ${flash ? `play-${flash}` : ""}`}>
      <header className="play-top">
        <span className="play-mark">MSG HOOPS</span>
        <span className={`play-dot ${live ? "on" : ""}`}>
          {live
            ? "Connected"
            : stale
            ? "No screen on this code"
            : connected
            ? "Waiting for the screen…"
            : "Connecting…"}
        </span>
      </header>

      <div className="play-score">
        <div className="ps-col"><b>{you}</b><span>You</span></div>
        <div className="ps-col ps-clock"><b>{fmt(secs)}</b><span>Clock</span></div>
        <div className="ps-col"><b>{rival}</b><span>Rival</span></div>
      </div>

      <div
        ref={padRef}
        className="play-pad"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={cancel}
      >
        {/* aim arrow: points up, tilts with your aim, grows with power */}
        <div
          className={`play-aim ${aiming && power > 0 ? "on" : ""}`}
          style={{ transform: `translateX(-50%) rotate(${aim * 26}deg) scaleY(${0.35 + power})` }}
          aria-hidden="true"
        />

        <div
          className={`play-ball ${shooting ? "shoot" : ""}`}
          style={shooting ? undefined : { transform: `translateY(${-power * 30}px) scale(${1 + power * 0.1})` }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <circle cx="12" cy="12" r="11" fill="#f4951f" stroke="#7a1405" strokeWidth="0.5" />
            <g stroke="#5a2408" strokeWidth="1.1" fill="none" strokeLinecap="round">
              <path d="M12 1v22M1 12h22M4.5 4.5c5 3.4 5 12.1 0 15.4M19.5 4.5c-5 3.4-5 12.1 0 15.4" />
            </g>
          </svg>
        </div>

        <p className="play-hint">Swipe UP to shoot — aim left/right, flick harder for more power</p>

        {!live && (
          <div className="play-wait">
            <b>
              {stale
                ? "That game code isn't live"
                : connected
                ? "Almost there…"
                : "Connecting…"}
            </b>
            <small>
              {stale ? (
                <>
                  No big screen is on code <b>{code}</b>. Open <b>MSG Hoops</b>{" "}
                  on the big screen and scan its QR code. Keep practicing your
                  flick here in the meantime.
                </>
              ) : (
                <>
                  Open <b>MSG Hoops</b> on the big screen and scan the code. You
                  can still practice your flick here.
                </>
              )}
            </small>
          </div>
        )}
      </div>

      {phase !== "playing" && live && (
        <button className="btn play-start" onClick={() => send({ t: "start" })}>
          {phase === "done" ? "Run it back" : "Tip it off"}
        </button>
      )}
      <p className="play-room">Room {code}</p>
    </main>
  );
}
