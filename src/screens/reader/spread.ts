/**
 * SUATU SAAT v2 — Spread Mode (Dual Panel, Matches Mockup Panel 5)
 */
import { getPageByGlobal } from "../../data/chapters";

export class SpreadMode {
  private container: HTMLElement;

  constructor(parent: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.padding = "0 14px";
    parent.appendChild(this.container);
  }

  public render(globalPage: number): void {
    const data = getPageByGlobal(globalPage);
    if (!data) return;

    const { chapter, page } = data;

    this.container.innerHTML = `
      <div class="book-spread" style="display: flex; width: 100%; height: 410px; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
        <!-- Left Panel: Text -->
        <div class="page-left-bg" style="flex: 1; padding: 20px 16px; display: flex; flex-direction: column; min-width: 0; position: relative;">
          <div class="p-eyebrow">BAB ${chapter.num}</div>
          <div class="p-title">${page.title}</div>
          <div class="p-body">
            ${page.paragraphs.slice(0, 3).map(p => `<p>${p}</p>`).join("")}
            ${page.quote ? `<blockquote>"${page.quote}"</blockquote>` : ''}
          </div>
          <div class="p-brand">SUATU SAAT</div>
        </div>

        <!-- Right Panel: Chapter Artwork Plate -->
        <div style="flex: 1; position: relative; overflow: hidden;">
          <img src="${chapter.image}" alt="${chapter.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);"></div>
          <div style="position: absolute; top: 12px; right: 12px; font-size: 9.5px; letter-spacing: 1px; color: var(--bone);">
            HAL ${page.globalPage}
          </div>
          <div style="position: absolute; bottom: 16px; left: 14px; right: 14px; font-family: var(--serif); font-style: italic; font-size: 11.5px; color: var(--bone); line-height: 1.4;">
            "${page.subtitle || chapter.title}"
          </div>
        </div>
      </div>
    `;
  }

  public destroy(): void {
    this.container.innerHTML = "";
  }
}
