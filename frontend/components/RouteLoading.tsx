/**
 * Branded route transition skeleton. Shown by Next while a route segment is
 * being prepared. A spinning ball plus a couple of shimmer bars so it reads as
 * "loading" rather than a blank flash.
 */
export default function RouteLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <div className="rl-ball" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <circle cx="12" cy="12" r="11" fill="#f4951f" stroke="#7a1405" strokeWidth="0.5" />
          <g stroke="#5a2408" strokeWidth="1.1" fill="none" strokeLinecap="round">
            <path d="M12 1v22M1 12h22M4.5 4.5c5 3.4 5 12.1 0 15.4M19.5 4.5c-5 3.4-5 12.1 0 15.4" />
          </g>
        </svg>
      </div>
      <div className="rl-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span className="rl-label cond">{label}</span>
    </div>
  );
}
