"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * The front door. Full 1946 tee print, 90s energy, DE FENSE stomps.
 * One job: welcome you, start the crowd, open the portal to the court.
 */
export default function Welcome() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  function leave() {
    if (leaving) return;
    // The crowd audio is kicked off by the tip-in video on the arena page,
    // so we don't start sound here — just fade out and head to the court.
    setLeaving(true);
    setTimeout(() => {
      // Raise the loading curtain first so the arena never flashes into view.
      window.dispatchEvent(new Event("msg:entering"));
      router.push("/court");
    }, 440);
  }

  return (
    <div className={`intro intro-tee ${leaving ? "leaving" : ""}`}>
      <div className="intro-inner">
        <div className="chant" aria-hidden="true">
          <span>DE&nbsp;·&nbsp;FENSE</span>
          <b>👏👏</b>
          <span>DE&nbsp;·&nbsp;FENSE</span>
          <b>👏👏</b>
          <span>DE&nbsp;·&nbsp;FENSE</span>
        </div>

        <button className="enter-btn" onClick={() => leave()}>
          <span className="enter-btn-label">Enter the Garden</span>
        </button>

        <p className="intro-skip">
          <a
            href="/court"
            onClick={(e) => {
              e.preventDefault();
              leave();
            }}
          >
            skip straight to the court
          </a>
        </p>
      </div>
    </div>
  );
}
