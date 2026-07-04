"use client";

import { useEffect, useState } from "react";

/**
 * Welcome gate. Shows once per session, all orange and blue.
 * The ENTER click doubles as the user gesture that lets audio start.
 */
export default function Intro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("msg_intro") !== "done") setShow(true);
  }, []);

  function enter() {
    sessionStorage.setItem("msg_intro", "done");
    window.dispatchEvent(new Event("msg:sound-start"));
    setLeaving(true);
    setTimeout(() => setShow(false), 550);
  }

  if (!show) return null;

  return (
    <div className={`intro ${leaving ? "leaving" : ""}`} role="dialog" aria-label="Welcome">
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
      </div>
    </div>
  );
}
