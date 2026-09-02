/**
 * SUATU SAAT v2 — Immersive Read Mode (Matches Mockup Panel 6)
 */
import { getPageByGlobal } from "../../data/chapters";

export class ImmersiveMode {
  private container: HTMLElement;

  constructor(parent: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.inset = "0";
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.justifyContent = "flex-end";
    parent.appendChild(this.container);
  }

  public render(globalPage: number): void {
    const data = getPageByGlobal(globalPage);
    if (!data) return;

    const { chapter, page } = data;

    this.container.innerHTML = `
      <!-- Full-bleed background image -->
      <div style="position: absolute; inset: 0; background-image: url('${chapter.image}'); background-size: cover; background-position: center; z-index: 0;"></div>
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.6) 50%, rgba(8,8,8,0.95) 100%); z-index: 1;"></div>

      <!-- Floating Text Content -->
      <div style="position: relative; z-index: 2; padding: 0 24px 20px; display: flex; flex-direction: column; max-height: 60%;">
        <div style="font-family: var(--sans); font-size: 10px; letter-spacing: 1.5px; color: var(--bone-dim); text-transform: uppercase; margin-bottom: 6px;">
          BAB ${chapter.num} · HALAMAN ${page.pageInChapter}/${chapter.pageCount}
        </div>

        <div style="font-family: var(--serif); font-size: 24px; font-weight: 500; line-height: 1.15; color: var(--bone); margin-bottom: 10px;">
          ${page.title}
        </div>

        <div style="overflow-y: auto; font-size: 12px; line-height: 1.65; color: rgba(235,226,214,0.85); font-weight: 300;">
          ${page.paragraphs.map(p => `<p style="margin-bottom: 8px;">${p}</p>`).join("")}
          ${page.quote ? `<blockquote style="font-style: italic; border-left: 2px solid var(--bone-dim); padding-left: 8px; margin-top: 8px;">"${page.quote}"</blockquote>` : ''}
        </div>
      </div>
    `;
  }

  public destroy(): void {
    this.container.innerHTML = "";
  }
}
