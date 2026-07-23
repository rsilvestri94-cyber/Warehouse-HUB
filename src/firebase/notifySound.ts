// Notification sound, synthesised on the fly with WebAudio: no audio file,
// everything stays in one bundle at zero cost. Two short, soft dings.
// Browsers block audio until the user has interacted with the page at least
// once, so the context is "unlocked" on the first click/tap.
const MUTE_KEY = "vestas_hub_mute_v1";

let ctx: AudioContext | null = null;
let unlocked = false;

function ensureCtx(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  return ctx;
}

function unlock() {
  unlocked = true;
  const c = ensureCtx();
  if (c && c.state === "suspended") c.resume().catch(() => {});
}

if (typeof window !== "undefined") {
  (["click", "keydown", "touchstart"] as const).forEach(ev =>
    window.addEventListener(ev, unlock, { passive: true }),
  );
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(m: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  } catch {
    // storage unavailable — mute preference just won't persist
  }
}

export function ring() {
  if (isMuted()) return;
  const c = ensureCtx();
  if (!c || !unlocked) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  const now = c.currentTime;
  // Two notes (A5, C#6): a discreet but clearly audible "ding-dong".
  ([[880, 0], [1108.73, 0.14]] as const).forEach(([freq, t]) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + t);
    gain.gain.exponentialRampToValueAtTime(0.55, now + t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.42);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now + t);
    osc.stop(now + t + 0.45);
  });
}
