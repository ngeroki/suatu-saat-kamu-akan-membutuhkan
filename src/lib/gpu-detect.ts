/**
 * SUATU SAAT v2 — GPU / Device Capability Detection
 * 3-Tier: high (StPageFlip curl) | mid (CSS 3D flip) | low (slide)
 */

export type RenderTier = "curl" | "flip3d" | "slide";

export interface DeviceCapabilities {
  tier: "high" | "mid" | "low";
  prefersReducedMotion: boolean;
  recommendedMode: RenderTier;
}

let _cached: DeviceCapabilities | null = null;

export function detectDeviceCapabilities(): DeviceCapabilities {
  if (_cached) return _cached;

  // 1. Accessibility: prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    _cached = { tier: "low", prefersReducedMotion: true, recommendedMode: "slide" };
    return _cached;
  }

  // 2. Hardware heuristics
  const ram = (navigator as any).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;

  // 3. WebGL GPU sniff
  let isLowEndGPU = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl) {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).toLowerCase() as string;
        if (renderer.includes("swiftshader") || renderer.includes("mali-4") || renderer.includes("adreno 3")) {
          isLowEndGPU = true;
        }
      }
    }
  } catch {
    isLowEndGPU = true;
  }

  if (ram >= 4 && cores >= 6 && !isLowEndGPU) {
    _cached = { tier: "high", prefersReducedMotion: false, recommendedMode: "curl" };
  } else if (ram >= 2 && cores >= 4) {
    _cached = { tier: "mid", prefersReducedMotion: false, recommendedMode: "flip3d" };
  } else {
    _cached = { tier: "low", prefersReducedMotion: false, recommendedMode: "slide" };
  }

  return _cached;
}

/** Runtime FPS monitor — downgrades tier if jank detected */
export function monitorFPS(onDowngrade: () => void): void {
  let frames = 0;
  let lastTime = performance.now();
  let jankCount = 0;

  const tick = (time: number) => {
    frames++;
    const delta = time - lastTime;

    if (delta >= 1000) {
      const fps = (frames / delta) * 1000;
      frames = 0;
      lastTime = time;

      if (fps < 30) {
        jankCount++;
        if (jankCount >= 3) {
          onDowngrade();
          return; // stop monitoring
        }
      } else {
        jankCount = 0;
      }
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
