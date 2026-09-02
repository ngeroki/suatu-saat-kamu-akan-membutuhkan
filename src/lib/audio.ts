/**
 * SUATU SAAT v2 — Cinematic Paper Flip Audio Engine
 * Modeled after premium game UI (Mobile Legends Hero Mastery Book)
 * Multi-layer procedural synthesis:
 *   1. Air displacement swoosh (low-pass filter sweep)
 *   2. Parchment friction & crinkle (modulated dual bandpass noise)
 *   3. Paper settle flap (resonant low-frequency snap)
 */

let audioCtx: AudioContext | null = null;
let audioEnabled = true;

function getContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function unlockAudio(): void {
  try {
    const ctx = getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    audioEnabled = true;
  } catch (e) {
    console.warn("Audio unlock failed:", e);
  }
}

export function setAudioEnabled(enabled: boolean): void {
  audioEnabled = enabled;
}

export function isAudioEnabled(): boolean {
  return audioEnabled;
}

/**
 * Play authentic, crisp parchment book page turn sound
 */
export function playPaperRustle(): void {
  if (!audioEnabled) return;

  try {
    const ctx = getContext();
    const now = ctx.currentTime;
    const duration = 0.28; // 280ms realistic flip duration

    // ─── LAYER 1: Air Whoosh (Air displacement as page swings) ───
    const whooshBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const whooshData = whooshBuffer.getChannelData(0);
    for (let i = 0; i < whooshData.length; i++) {
      whooshData[i] = (Math.random() * 2 - 1) * 0.45;
    }

    const whooshSrc = ctx.createBufferSource();
    whooshSrc.buffer = whooshBuffer;

    const whooshFilter = ctx.createBiquadFilter();
    whooshFilter.type = "lowpass";
    whooshFilter.frequency.setValueAtTime(320, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(750, now + 0.1);
    whooshFilter.frequency.exponentialRampToValueAtTime(180, now + duration);

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.01, now);
    whooshGain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whooshSrc.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whooshSrc.start(now);
    whooshSrc.stop(now + duration);

    // ─── LAYER 2: Parchment Texture (Friction & crinkle of heavy paper) ───
    const crinkleBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const crinkleData = crinkleBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < crinkleData.length; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter approximation
      crinkleData[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = crinkleData[i];
      crinkleData[i] *= 2.8;
    }

    const crinkleSrc = ctx.createBufferSource();
    crinkleSrc.buffer = crinkleBuffer;

    const crinkleFilter = ctx.createBiquadFilter();
    crinkleFilter.type = "bandpass";
    crinkleFilter.frequency.setValueAtTime(1200, now);
    crinkleFilter.frequency.exponentialRampToValueAtTime(2600, now + 0.12);
    crinkleFilter.frequency.exponentialRampToValueAtTime(900, now + duration);
    crinkleFilter.Q.value = 1.4;

    const crinkleGain = ctx.createGain();
    crinkleGain.gain.setValueAtTime(0.01, now);
    crinkleGain.gain.linearRampToValueAtTime(0.42, now + 0.07);
    crinkleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    crinkleSrc.connect(crinkleFilter);
    crinkleFilter.connect(crinkleGain);
    crinkleGain.connect(ctx.destination);
    crinkleSrc.start(now);
    crinkleSrc.stop(now + duration);

    // ─── LAYER 3: Paper Settle Flap (Landing snap at end of turn) ───
    const settleOsc = ctx.createOscillator();
    settleOsc.type = "triangle";
    settleOsc.frequency.setValueAtTime(140, now + 0.14);
    settleOsc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

    const settleGain = ctx.createGain();
    settleGain.gain.setValueAtTime(0, now);
    settleGain.gain.setValueAtTime(0.28, now + 0.14);
    settleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    settleOsc.connect(settleGain);
    settleGain.connect(ctx.destination);
    settleOsc.start(now + 0.14);
    settleOsc.stop(now + 0.24);

  } catch (e) {
    console.warn("Audio playback error:", e);
  }
}
