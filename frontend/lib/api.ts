const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json();
}

export interface Profile {
  total_facts: number;
  rare_pulls: number;
  best_quiz: number;
  best_quiz_rank: string;
  takes_generated: number;
  day_streak: number;
  last_played: string | null;
}

const BLOB_KEY = "msg_profile_blob";

export async function syncProfile(
  event?: "fact" | "rare" | "take" | "quiz_best",
  value = 0
): Promise<{ profile: Profile; tampered: boolean }> {
  const blob =
    typeof window !== "undefined" ? localStorage.getItem(BLOB_KEY) : null;
  const out = await api<{ profile: Profile; blob: string; tampered: boolean }>(
    "/api/profile/sync",
    { method: "POST", body: JSON.stringify({ blob, event: event ?? null, value }) }
  );
  if (typeof window !== "undefined") localStorage.setItem(BLOB_KEY, out.blob);
  return { profile: out.profile, tampered: out.tampered };
}
