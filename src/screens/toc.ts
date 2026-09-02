/**
 * SUATU SAAT v2 — Screen 3: Daftar Isi / TOC
 * Backed by 187 Unabridged Pages from Single Source of Truth (src/data/book.ts)
 */
import { CHAPTERS, PAGES } from "../data/book";
import { navigate } from "../router";

export class TocScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-toc";
    this.el.style.background = "#0A0A08";

    // Build TOC breakdown directly from canonical CHAPTERS and PAGES
    const blocksHTML = CHAPTERS.map((ch, idx) => {
      const isInitialOpen = idx === 1; // Open Bab 1 by default
      const chapPages = PAGES.filter(p => p.chapter_id === ch.id);

      // Extract unique subchapters with their first page
      const subchaptersMap = new Map<string, number>();
      for (const p of chapPages) {
        if (!subchaptersMap.has(p.subchapter_name)) {
          subchaptersMap.set(p.subchapter_name, p.page_in_chap);
        }
      }

      const subitems = Array.from(subchaptersMap.entries());
      const subitemsRows = subitems.map(([subTitle, pageInChap], sIdx) => {
        const subNumStr = (sIdx + 1) < 10 ? `0${sIdx + 1}` : `${sIdx + 1}`;
        const targetPage = chapPages.find(p => p.page_in_chap === pageInChap);
        const globalPageStr = targetPage ? (targetPage.page_number < 10 ? `0${targetPage.page_number}` : `${targetPage.page_number}`) : "01";
        const cleanTitle = subTitle.replace(/\n/g, " ");

        return `
          <div class="toc-subitem-row" data-chap="${ch.id}" data-page="${pageInChap}" style="display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0; cursor: pointer; transition: color 0.15s ease;">
            <span style="display: flex; align-items: baseline; gap: 12px; flex: 1; padding-right: 12px;">
              <span style="font-family: var(--sans); font-size: 12px; color: rgba(235, 226, 214, 0.45); font-weight: 500; width: 20px; flex-shrink: 0;">${subNumStr}</span>
              <span class="sub-title-text" style="font-family: var(--serif); font-size: 14.5px; color: #EDE4D8; line-height: 1.35;">${cleanTitle}</span>
            </span>
            <span style="font-family: var(--sans); font-size: 12px; color: rgba(235, 226, 214, 0.45); font-weight: 400; flex-shrink: 0;">${globalPageStr}</span>
          </div>
        `;
      }).join("");

      const startStr = ch.pageStart < 10 ? `0${ch.pageStart}` : `${ch.pageStart}`;

      return `
        <div class="toc-accordion-block ${isInitialOpen ? 'open' : ''}" style="border-bottom: 1px solid rgba(235, 226, 214, 0.08); padding: 18px 0;">
          <!-- Accordion Header -->
          <div class="toc-accordion-header" style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; user-select: none;">
            <div>
              <div style="font-family: var(--sans); font-size: 10px; letter-spacing: 2px; color: #9E8062; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
                ${ch.code}
              </div>
              <div style="font-family: var(--serif); font-size: 17.5px; font-weight: 500; line-height: 1.25; color: #EDE4D8; white-space: pre-line;">
                ${ch.title}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; padding-top: 4px;">
              <span class="toc-page-badge" style="font-family: var(--sans); font-size: 13px; color: rgba(235, 226, 214, 0.45); ${isInitialOpen ? 'display: none;' : ''}">${startStr}</span>
              <span class="toc-chevron" style="font-size: 13px; color: rgba(235, 226, 214, 0.7); transition: transform 0.25s ease; line-height: 1;">${isInitialOpen ? '⌃' : '⌄'}</span>
            </div>
          </div>

          <!-- Dropdown Sub-items Container -->
          <div class="toc-accordion-body" style="display: ${isInitialOpen ? 'flex' : 'none'}; flex-direction: column; gap: 4px; padding-top: 14px; padding-left: 2px;">
            ${subitemsRows}
          </div>
        </div>
      `;
    }).join("");

    this.el.innerHTML = `
      <!-- Top Header -->
      <div class="ph-header" style="padding: 24px 26px 16px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--serif); font-size: 24px; font-weight: 500; letter-spacing: 1px; color: #EDE4D8;">DAFTAR ISI</span>
        <span class="close-btn" id="toc-close-btn" style="font-size: 18px; color: #EDE4D8; cursor: pointer; padding: 4px;">✕</span>
      </div>

      <!-- TOC List Scroll Area -->
      <div class="toc-scroll-area" style="flex: 1; overflow-y: auto; padding: 0 26px 24px; max-width: 480px; width: 100%; margin: 0 auto;">
        ${blocksHTML}

        <!-- Total Page Counter -->
        <div style="text-align: left; font-family: var(--sans); font-size: 11px; color: rgba(235, 226, 214, 0.45); padding: 24px 0 32px; letter-spacing: 0.3px;">
          Total ${PAGES.length} Halaman Lengkap · 5 Bab Nusantara
        </div>
      </div>
    `;

    container.appendChild(this.el);

    // Event Listeners
    this.el.querySelector("#toc-close-btn")?.addEventListener("click", () => navigate("cover"));

    // Accordion Toggle
    this.el.querySelectorAll(".toc-accordion-block").forEach(block => {
      const header = block.querySelector(".toc-accordion-header");
      const body = block.querySelector(".toc-accordion-body") as HTMLElement;
      const chevron = block.querySelector(".toc-chevron") as HTMLElement;
      const pageBadge = block.querySelector(".toc-page-badge") as HTMLElement;

      header?.addEventListener("click", () => {
        const isOpen = block.classList.contains("open");
        if (isOpen) {
          block.classList.remove("open");
          body.style.display = "none";
          chevron.textContent = "⌄";
          if (pageBadge) pageBadge.style.display = "inline";
        } else {
          block.classList.add("open");
          body.style.display = "flex";
          chevron.textContent = "⌃";
          if (pageBadge) pageBadge.style.display = "none";
        }
      });
    });

    // Subitem Click Navigation: Guarantee accurate chap and page
    this.el.querySelectorAll(".toc-subitem-row").forEach(row => {
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        const chap = parseInt(row.getAttribute("data-chap") || "1", 10);
        const page = parseInt(row.getAttribute("data-page") || "1", 10);
        navigate("read", { chap, page });
      });

      row.addEventListener("mouseenter", () => {
        const titleEl = row.querySelector(".sub-title-text") as HTMLElement;
        if (titleEl) titleEl.style.color = "#FFFFFF";
      });
      row.addEventListener("mouseleave", () => {
        const titleEl = row.querySelector(".sub-title-text") as HTMLElement;
        if (titleEl) titleEl.style.color = "#EDE4D8";
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
