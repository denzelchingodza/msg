/**
 * Tactile feedback: light haptic buzz (mobile) + a soft synthesized tick.
 * No audio assets — the tick is generated with WebAudio. Respects the app's
 * sound mute (localStorage msg_sound === "off").
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctx) ctx = new AC();
    return ctx;
  } catch {
    return null;
  }
}

function soundOn(): boolean {
  try {
    return localStorage.getItem("msg_sound") !== "off";
  } catch {
    return true;
  }
}

export function haptic(ms: number | number[] = 6) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}

function tick(freq = 420, vol = 0.045, dur = 0.06) {
  if (!soundOn()) return;
  const a = audio();
  if (!a) return;
  if (a.state === "suspended") a.resume().catch(() => {});
  const now = a.currentTime;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(now);
  osc.stop(now + dur + 0.01);
}

/** A generic press. */
export function tap() {
  haptic(6);
  tick();
}

/** A positive/confirming interaction. */
export function tapSuccess() {
  haptic(12);
  tick(660, 0.05, 0.09);
}

/** A negative/miss interaction. */
export function tapError() {
  haptic([8, 26, 8]);
  tick(170, 0.05, 0.09);
}
