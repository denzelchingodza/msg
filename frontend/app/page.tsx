"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * The front door. Vintage poster, DE FENSE stomps, one job:
 * welcome you, start the crowd, open the portal to the court.
 */
export default function Welcome() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  function enter() {
    window.dispatchEvent(new Event("msg:sound-start"));
    setLeaving(true);
    setTimeout(() => router.push("/court"), 500);
  }

  return (
    <div className={`intro ${leaving ? "leaving quake" : ""}`}>
      <div className="intro-inner">
        <p className="intro-kicker">MADISON SQUARE GARDEN PRESENTS</p>

        <div className="intro-poster rumble">
          <img src="/photos/knixx.jpg" alt="Vintage New York Knicks poster" />
        </div>

        <div className="chant" aria-hidden="true">
          <span>DE&nbsp;·&nbsp;FENSE</span>
          <b>👏👏</b>
          <span>DE&nbsp;·&nbsp;FENSE</span>
          <b>👏👏</b>
          <span>DE&nbsp;·&nbsp;FENSE</span>
        </div>

        <h1 className="intro-title">WELCOME TO THE GARDEN</h1>
        <p className="intro-sub">
          Home of the 2026 NBA champions. First title in 53 years.
        </p>
        <button className="btn-ticket intro-enter" onClick={enter}>
          ENTER THE GARDEN
        </button>
        <p className="intro-note">the crowd is waiting inside 🔊</p>
        <p className="intro-skip">
          <Link href="/court">skip straight to the court →</Link>
        </p>
      </div>
    </div>
  );
}
