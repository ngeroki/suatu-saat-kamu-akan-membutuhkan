/**
 * SUATU SAAT v2 — Nav Track Component
 * Minimal line with dot position indicator + prev/next circles
 */

export class NavTrack {
  private container: HTMLElement;
  private dotEl!: HTMLElement;
  private prevBtn!: HTMLElement;
  private nextBtn!: HTMLElement;
  private onPrevCb?: () => void;
  private onNextCb?: () => void;

  constructor(parent: HTMLElement) {
    this.container = document.createElement("div");
    this.container.className = "nav-track-bar";
    this.container.innerHTML = `
      <div class="nav-circle" id="nav-prev">←</div>
      <div class="nav-track">
        <div class="nav-dot" id="nav-dot" style="left: 0%;"></div>
      </div>
      <div class="nav-circle" id="nav-next">→</div>
    `;

    parent.appendChild(this.container);
    this.dotEl = this.container.querySelector("#nav-dot") as HTMLElement;
    this.prevBtn = this.container.querySelector("#nav-prev") as HTMLElement;
    this.nextBtn = this.container.querySelector("#nav-next") as HTMLElement;

    this.prevBtn.addEventListener("click", () => this.onPrevCb?.());
    this.nextBtn.addEventListener("click", () => this.onNextCb?.());
  }

  public update(current: number, total: number): void {
    const percent = total > 1 ? Math.max(0, Math.min(100, ((current - 1) / (total - 1)) * 100)) : 0;
    this.dotEl.style.left = `${percent}%`;

    if (current <= 1) {
      this.prevBtn.classList.add("disabled");
    } else {
      this.prevBtn.classList.remove("disabled");
    }

    if (current >= total) {
      this.nextBtn.classList.add("disabled");
    } else {
      this.nextBtn.classList.remove("disabled");
    }
  }

  public onPrev(cb: () => void): void {
    this.onPrevCb = cb;
  }

  public onNext(cb: () => void): void {
    this.onNextCb = cb;
  }
}
