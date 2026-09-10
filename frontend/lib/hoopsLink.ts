"use client";

import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** ws:// for http, wss:// for https. */
export function wsBase() {
  return API.replace(/^http/, "ws");
}

export type LinkMsg = Record<string, unknown> & { t: string };

/** Short, unambiguous room code (no easily-confused characters). */
export function makeRoom() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}

/**
 * Connects to the Hoops relay for a room as either the desktop (host) or the
 * phone (pad). Forwards every message to onMsg, tracks connection + whether the
 * other side is present, auto-reconnects, and returns a send().
 */
export function useHoopsLink(
  room: string | null,
  role: "host" | "pad",
  onMsg: (m: LinkMsg) => void
) {
  const [connected, setConnected] = useState(false);
  const [peer, setPeer] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const onMsgRef = useRef(onMsg);
  onMsgRef.current = onMsg;

  useEffect(() => {
    if (!room) return;
    let closed = false;
    let retry: ReturnType<typeof setTimeout>;

    const connect = () => {
      const ws = new WebSocket(`${wsBase()}/ws/hoops/${room}?role=${role}`);
      wsRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setPeer(false);
        if (!closed) retry = setTimeout(connect, 1500);
      };
      ws.onmessage = (e) => {
        let m: LinkMsg;
        try {
          m = JSON.parse(e.data);
        } catch {
          return;
        }
        if (m.t === "peer") setPeer(Boolean(m.joined));
        else if (m.t === "ready") setPeer((m.peers as number) > 0);
        onMsgRef.current(m);
      };
    };

    connect();
    return () => {
      closed = true;
      clearTimeout(retry);
      wsRef.current?.close();
    };
  }, [room, role]);

  const send = (m: LinkMsg) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(m));
  };

  return { connected, peer, send };
}
