"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** The front door. Coming up from 34th and 8th into the Mecca. */
export default function Welcome() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  function leave() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      window.dispatchEvent(new Event("msg:entering"));
      router.push("/court");
    }, 440);
  }

  return (
    <div className={`intro intro-vintage ${leaving ? "leaving" : ""}`}>
      <div className="mecca-layout">
        <div className="mecca-top">
          <div className="chant" aria-hidden="true">
            <span>DE&nbsp;·&nbsp;FENSE</span>
            <b>👏👏</b>
            <span>DE&nbsp;·&nbsp;FENSE</span>
            <b>👏👏</b>
            <span>DE&nbsp;·&nbsp;FENSE</span>
          </div>
        </div>

        <div className="mecca-cta">
          <p className="mecca-eyebrow">Knicks basketball since 1946</p>
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
    </div>
  );
}
