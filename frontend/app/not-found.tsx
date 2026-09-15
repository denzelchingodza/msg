import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Airball · MSG",
  description: "That shot missed everything. The page you wanted isn't in the building.",
};

/** Branded 404 — an airball. Off the side of the rim and into the seats. */
export default function NotFound() {
  return (
    <main className="oops">
      <div className="oops-panel">
        <p className="oops-kicker cond">Off the mark</p>
        <h1 className="oops-code">404</h1>
        <p className="oops-head">Airball.</p>
        <p className="oops-text">
          That shot missed everything. The page you were looking for isn&apos;t
          in the building, or it got traded before you arrived.
        </p>
        <div className="oops-actions">
          <Link className="btn" href="/court">
            Back to the court
          </Link>
          <Link className="oops-alt" href="/">
            Start from the front door
          </Link>
        </div>
        <p className="oops-fine cond">Shake it off. Next one falls.</p>
      </div>
    </main>
  );
}
