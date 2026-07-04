"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * The front door. Orange and blue, one job:
 * welcome you, start the crowd, and open the portal to the court.
 */
export default function Welcome() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  function enter() {
    window.dispatchEvent(new Event("msg:sound-start"));
    setLeaving(true);
    setTimeout(() => router.push("/court"), 450);
  }

  return (
    <div className={`intro ${leaving ? "leaving" : ""}`}>
      <div className="intro-inner">
        <div className="intro-medallion">
          <img src="/photos/knicks.jpg" alt="New York Knicks logo" />
        </div>
        <p className="intro-kicker">MADISON SQUARE GARDEN PRESENTS</p>
        <h1 className="intro-title">
          WELCOME TO
          <br />
          THE GARDEN
        </h1>
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
