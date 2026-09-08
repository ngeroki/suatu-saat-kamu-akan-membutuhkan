/**
 * SUATU SAAT — Toast Notification Utility
 * Lightweight, non-intrusive floating feedback with optional action button.
 */

interface ToastAction {
  label: string;
  onClick: () => void;
}

let activeToastTimer: number | null = null;

export function showToast(
  message: string,
  durationMs: number = 2800,
  action?: ToastAction
): void {
  const existing = document.querySelector(".ss-toast-container");
  if (existing) {
    existing.remove();
  }
  if (activeToastTimer !== null) {
    window.clearTimeout(activeToastTimer);
    activeToastTimer = null;
  }

  const container = document.createElement("div");
  container.className = "ss-toast-container";

  const pill = document.createElement("div");
  pill.className = "ss-toast-pill";

  const textSpan = document.createElement("span");
  textSpan.className = "ss-toast-msg";
  textSpan.textContent = message;
  pill.appendChild(textSpan);

  if (action) {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "ss-toast-action-btn";
    actionBtn.textContent = action.label;
    actionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      container.classList.add("fade-out");
      setTimeout(() => container.remove(), 250);
      action.onClick();
    });
    pill.appendChild(actionBtn);
  }

  container.appendChild(pill);
  document.body.appendChild(container);

  activeToastTimer = window.setTimeout(() => {
    container.classList.add("fade-out");
    setTimeout(() => {
      container.remove();
    }, 250);
    activeToastTimer = null;
  }, durationMs);
}
