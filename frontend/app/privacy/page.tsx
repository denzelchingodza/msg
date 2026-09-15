import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What MSG stores and what it doesn't. Short version: almost nothing, and none of it is you.",
};

export default function Privacy() {
  return (
    <main className="legal">
      <div className="legal-wrap">
        <p className="legal-kicker cond">The fine print</p>
        <h1 className="legal-h1">Privacy</h1>
        <p className="legal-lead">
          MSG is a fan-made toy. It is built to be fun, not to follow you around.
          Here is the whole story in plain language.
        </p>

        <h2 className="legal-h2">What stays on your device</h2>
        <p>
          Your game progress, coins, unlocks, best scores, and settings live in
          your browser&apos;s local storage on this device. That data never
          leaves your machine unless you choose to sync it, and clearing your
          browser data wipes it.
        </p>

        <h2 className="legal-h2">What the server sees</h2>
        <p>
          When you sync progress, MSG sends a small signed blob of your own
          stats (facts pulled, best quiz, takes generated, day streak) so the
          numbers can be verified and returned. There is no account, no name, no
          email, and no login. The server does not build a profile of you.
        </p>
        <p>
          For MSG Hoops with a phone controller, your phone and the big screen
          connect through a short-lived game code. The server just relays the
          shots between the two screens and forgets the room the moment both
          disconnect. Nothing about a game is stored.
        </p>

        <h2 className="legal-h2">What MSG does not do</h2>
        <p>
          No ad trackers, no selling data, no third-party analytics that
          identify you, no cookies used for tracking. Basic server logs may
          briefly record request info (like an IP address) to keep the service
          running and to rate-limit abuse, and are not used to identify you.
        </p>

        <h2 className="legal-h2">Photos and audio</h2>
        <p>
          The images and sound in MSG are personal memorabilia used for a fan
          tribute. They are not part of the public code repository.
        </p>

        <p className="legal-fine">
          Fan-made. Not affiliated with, authorized by, or endorsed by the NBA
          or the New York Knicks. Questions? This is a hobby project by a fan.
        </p>

        <Link className="btn" href="/court">
          Back to the court
        </Link>
      </div>
    </main>
  );
}
