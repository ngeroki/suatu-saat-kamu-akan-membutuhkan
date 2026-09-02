/**
 * SUATU SAAT v2 — Screen 3: Daftar Isi / TOC (Matches Mockup Panel 3)
 */
import { CHAPTERS } from "../data/chapters";
import { navigate } from "../router";

export class TocScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-toc";

    const chaptersHTML = CHAPTERS.map((ch, idx) => {
      const isOpen = idx === 0 ? "open" : "";
      const pagesHTML = ch.pages.map(p => `
        <div class="toc-sub" data-chap="${ch.id}" data-page="${p.pageInChapter}">
          <span>
            <b class="toc-sub-num">${p.pageInChapter < 10 ? '0' + p.pageInChapter : p.pageInChapter}</b>
            <span class="toc-sub-title">${p.title}</span>
          </span>
          <span class="toc-sub-page">${p.globalPage < 10 ? '0' + p.globalPage : p.globalPage}</span>
        </div>
      `).join("");

      return `
        <div class="toc-bab-block ${isOpen}" style="border-bottom: 1px solid var(--line); padding: 14px 0;">
          <div class="toc-bab-head" style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer;">
            <div>
              <div class="toc-bab-eyebrow">BAB ${ch.num}</div>
              <div class="toc-bab-name">${ch.title}</div>
            </div>
            <div class="toc-chev" style="font-size: 13px; color: var(--bone-dim); margin-top: 4px;">▼</div>
          </div>
          <div class="toc-subitems" style="display: flex; flex-direction: column; gap: 9px; margin-top: 14px;">
            ${pagesHTML}
          </div>
        </div>
      `;
    }).join("");

    this.el.innerHTML = `
      <!-- Status Bar -->
      <div class="statusbar">
        <span>9:41</span>
        <div class="icons">
          <svg width="22" height="11" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#EBE2D6" fill="none"/><rect x="2" y="2" width="15" height="8" rx="1" fill="#EBE2D6"/></svg>
        </div>
      </div>

      <!-- Top Header -->
      <div class="ph-header">
        <span style="font-family: var(--sans); font-size: 15px; font-weight: 600; letter-spacing: 1px; color: var(--bone);">DAFTAR ISI</span>
        <span class="close-btn" id="toc-close-btn">✕</span>
      </div>

      <!-- TOC Scroll Area -->
      <div class="toc-scroll" style="flex: 1; overflow-y: auto; padding: 0 22px 20px;">
        ${chaptersHTML}

        <!-- Penutup Row -->
        <div class="toc-bab-block" style="border-bottom: 1px solid var(--line); padding: 14px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" id="toc-penutup-row">
          <div>
            <div class="toc-bab-eyebrow">PENUTUP</div>
            <div class="toc-bab-name" style="font-size: 16px;">Aku Telah Pulang: Titik Nol Keheningan</div>
          </div>
          <span style="font-size: 12.5px; color: var(--bone-faint);">74</span>
        </div>

        <div style="text-align: center; font-size: 10.5px; color: var(--bone-faint); padding: 16px 0 8px;">
          Total 74 Halaman
        </div>

        <button class="btn-primary" id="toc-btn-baca" style="margin-top: 10px;">
          Mulai Membaca →
        </button>
      </div>
    `;

    container.appendChild(this.el);

    // Event Listeners
    this.el.querySelector("#toc-close-btn")?.addEventListener("click", () => navigate("cover"));
    this.el.querySelector("#toc-btn-baca")?.addEventListener("click", () => navigate("read", { chap: 1, page: 1 }));
    this.el.querySelector("#toc-penutup-row")?.addEventListener("click", () => navigate("read", { chap: 5, page: 15 }));

    // Accordion Toggle
    this.el.querySelectorAll(".toc-bab-head").forEach(head => {
      head.addEventListener("click", () => {
        const block = head.parentElement;
        if (block) {
          block.classList.toggle("open");
        }
      });
    });

    // Subitem Click
    this.el.querySelectorAll(".toc-sub").forEach(sub => {
      sub.addEventListener("click", (e) => {
        e.stopPropagation();
        const chap = parseInt(sub.getAttribute("data-chap") || "1", 10);
        const page = parseInt(sub.getAttribute("data-page") || "1", 10);
        navigate("read", { chap, page });
      });
    });
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
