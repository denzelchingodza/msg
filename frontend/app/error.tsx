"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Catches render/runtime errors inside the app
 * and offers a clean reset instead of a white screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface it in the console for anyone digging in devtools.
    console.error(error);
  }, [error]);

  return (
    <main className="oops">
      <div className="oops-panel">
        <p className="oops-kicker cond">Whistle blown</p>
        <h1 className="oops-code">TO</h1>
        <p className="oops-head">Turnover.</p>
        <p className="oops-text">
          Something went wrong on our end and we lost the handle. It happens to
          the best of them. Give it another run.
        </p>
        <div className="oops-actions">
          <button className="btn" onClick={() => reset()}>
            Run it back
          </button>
          <Link className="oops-alt" href="/court">
            Back to the court
          </Link>
        </div>
        {error?.digest && (
          <p className="oops-fine cond">Ref code {error.digest}</p>
        )}
      </div>
    </main>
  );
}
