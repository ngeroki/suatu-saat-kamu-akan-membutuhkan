/**
 * SUATU SAAT v2 — Authentic Studio Paper Flip Audio Engine
 * Preloads real studio recordings of physical book page turns and parchment friction:
 *   1. Crisp single page turn (/audio/page-flip-1.mp3)
 *   2. Stiff art paper book page turn (/audio/page-flip-2.mp3)
 *   3. Natural book page turn (/audio/page-flip-3.mp3)
 *   4. Tactile paper slide friction (/audio/paper-slide.mp3)
 * Features:
 *   - Zero-latency pre-decoded Web Audio API buffers
 *   - Multi-take randomization for natural variety
 *   - Organic micro-pitch & dynamics modulation
 *   - Procedural synthesis fallback (100% resilient)
 */

let audioCtx: AudioContext | null = null;
let audioEnabled = true;

const SFX_PAGE_TURNS = [
  "/audio/page-flip-1.mp3",
  "/audio/page-flip-2.mp3",
  "/audio/page-flip-3.mp3",
];
const SFX_PAPER_SLIDE = "/audio/paper-slide.mp3";

const pageTurnBuffers: AudioBuffer[] = [];
let paperSlideBuffer: AudioBuffer | null = null;
let isPreloading = false;
let isPreloaded = false;

function getContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

async function fetchAndDecode(
  url: string,
  ctx: AudioContext
): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.warn(`[Audio] Failed to load ${url}:`, e);
    return null;
  }
}

export async function preloadAudio(): Promise<void> {
  if (isPreloading || isPreloaded) return;
  isPreloading = true;

  try {
    const ctx = getContext();
    const turnPromises = SFX_PAGE_TURNS.map((url) => fetchAndDecode(url, ctx));
    const slidePromise = fetchAndDecode(SFX_PAPER_SLIDE, ctx);

    const [turns, slide] = await Promise.all([
      Promise.all(turnPromises),
      slidePromise,
    ]);

    for (const buf of turns) {
      if (buf) pageTurnBuffers.push(buf);
    }
    if (slide) paperSlideBuffer = slide;
    isPreloaded = true;
  } catch (e) {
    console.warn("[Audio] Preload error:", e);
  } finally {
    isPreloading = false;
  }
}

// Auto-trigger preload early
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", () => unlockAudio(), { once: true });
  window.addEventListener("keydown", () => unlockAudio(), { once: true });
}

export function unlockAudio(): void {
  try {
    const ctx = getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    audioEnabled = true;
    preloadAudio();
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
 * Play authentic physical page turn sound with randomized variation
 */
export function playPageTurn(): void {
  if (!audioEnabled) return;

  try {
    const ctx = getContext();

    if (pageTurnBuffers.length > 0) {
      // Pick random take from loaded studio buffers
      const randIdx = Math.floor(Math.random() * pageTurnBuffers.length);
      const buffer = pageTurnBuffers[randIdx];

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Organic micro-pitch variation (0.95 - 1.05)
      source.playbackRate.value = 0.95 + Math.random() * 0.1;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.8 + Math.random() * 0.15;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
      return;
    }

    // Fallback to procedural synth if audio file is still loading
    playProceduralRustle(ctx);
  } catch (e) {
    console.warn("Page turn sound error:", e);
  }
}

/**
 * Play tactile paper sheet flip / friction sound (for Side A <-> Side B sheet flip)
 */
export function playPaperSlide(): void {
  if (!audioEnabled) return;

  try {
    const ctx = getContext();

    if (paperSlideBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = paperSlideBuffer;
      source.playbackRate.value = 0.97 + Math.random() * 0.08;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.75;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
      return;
    }

    playPageTurn();
  } catch (e) {
    console.warn("Paper slide sound error:", e);
  }
}

/**
 * Main export kept for backward compatibility
 */
export function playPaperRustle(): void {
  playPageTurn();
}

/**
 * Fallback procedural synthesis
 */
let cachedWhooshBuffer: AudioBuffer | null = null;
let cachedCrinkleBuffer: AudioBuffer | null = null;

function getWhooshBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  if (!cachedWhooshBuffer || cachedWhooshBuffer.sampleRate !== ctx.sampleRate) {
    cachedWhooshBuffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * duration),
      ctx.sampleRate
    );
    const data = cachedWhooshBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }
  }
  return cachedWhooshBuffer;
}

function getCrinkleBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  if (
    !cachedCrinkleBuffer ||
    cachedCrinkleBuffer.sampleRate !== ctx.sampleRate
  ) {
    cachedCrinkleBuffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * duration),
      ctx.sampleRate
    );
    const data = cachedCrinkleBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.8;
    }
  }
  return cachedCrinkleBuffer;
}

function playProceduralRustle(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const duration = 0.28;

  const whooshBuffer = getWhooshBuffer(ctx, duration);
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

  const crinkleBuffer = getCrinkleBuffer(ctx, duration);
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
}
