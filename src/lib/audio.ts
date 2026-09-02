/**
 * SUATU SAAT v2 — Web Audio Paper Rustle Synthesizer
 * Procedural paper turn sound: white noise + bandpass @ 1150Hz
 */

let audioCtx: AudioContext | null = null;
let enabled = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function unlockAudio(): void {
  getCtx();
}

export function setAudioEnabled(on: boolean): void {
  enabled = on;
}

export function isAudioEnabled(): boolean {
  return enabled;
}

export function playPaperRustle(duration = 0.12): void {
  if (!enabled) return;
  const ctx = getCtx();

  // White noise buffer
  const bufSize = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;

  // Bandpass filter at ~1150Hz (paper crinkle frequency)
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1150;
  bp.Q.value = 0.8;

  // Gain envelope
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  src.connect(bp);
  bp.connect(gain);
  gain.connect(ctx.destination);

  src.start(now);
  src.stop(now + duration);
}
