"use client";

import { useEffect, useState } from "react";

/** New York time, always. The building runs on Garden time. */
export default function GardenTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span className="garden-time">
      <i>GARDEN TIME</i>
      {time} NYC
    </span>
  );
}
