/**
 * SUATU SAAT v2 — Touch/Swipe/Tap Gesture Handler
 */

export interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTapLeft?: () => void;
  onTapRight?: () => void;
  threshold?: number;   // min px for swipe (default 50)
  tapZone?: number;     // fraction of width for tap zones (default 0.3 = 30%)
}

export function attachGestures(el: HTMLElement, opts: SwipeOptions): () => void {
  const threshold = opts.threshold ?? 50;
  const tapZone = opts.tapZone ?? 0.3;

  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const onStart = (x: number, y: number) => {
    startX = x;
    startY = y;
    startTime = Date.now();
  };

  const onEnd = (x: number, y: number) => {
    const dx = x - startX;
    const dy = y - startY;
    const dt = Date.now() - startTime;

    // Ignore if vertical scroll intent
    if (Math.abs(dy) > Math.abs(dx) * 1.5) return;

    if (Math.abs(dx) >= threshold) {
      if (dx < 0) opts.onSwipeLeft?.();
      else opts.onSwipeRight?.();
      return;
    }

    // Tap detection (< 200ms, minimal movement)
    if (dt < 200 && Math.abs(dx) < 10) {
      const rect = el.getBoundingClientRect();
      const relX = (startX - rect.left) / rect.width;
      if (relX < tapZone) opts.onTapLeft?.();
      else if (relX > (1 - tapZone)) opts.onTapRight?.();
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) onStart(t.clientX, t.clientY);
  };
  const onTouchEnd = (e: TouchEvent) => {
    const t = e.changedTouches[0];
    if (t) onEnd(t.clientX, t.clientY);
  };
  const onPointerDown = (e: PointerEvent) => onStart(e.clientX, e.clientY);
  const onPointerUp = (e: PointerEvent) => onEnd(e.clientX, e.clientY);

  el.addEventListener("touchstart", onTouchStart, { passive: true });
  el.addEventListener("touchend", onTouchEnd, { passive: true });
  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointerup", onPointerUp);

  return () => {
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchend", onTouchEnd);
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointerup", onPointerUp);
  };
}

export function attachKeyboardNav(
  onLeft: () => void,
  onRight: () => void
): () => void {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") onLeft();
    if (e.key === "ArrowRight") onRight();
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}
