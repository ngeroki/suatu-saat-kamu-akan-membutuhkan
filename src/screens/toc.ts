/**
 * SUATU SAAT v2 — Screen 3: Daftar Isi / TOC (100% Mockup Aligned Dropdown Per Bab)
 */
import { CHAPTERS } from "../data/chapters";
import { navigate } from "../router";

// Sub-items breakdown per chapter matching manuscript & mockup
const TOC_BREAKDOWN = [
  {
    chapId: 1,
    num: "01",
    title: "Anatomi Tubuh Energi\n& Memori Karma",
    pageStart: "01",
    subitems: [
      { subNum: "01", title: "Tubuh Energi Manusia", page: "01", pageInChap: 1 },
      { subNum: "02", title: "Medan Torus Manusia", page: "04", pageInChap: 4 },
      { subNum: "03", title: "Memori Karma", page: "09", pageInChap: 9 },
      { subNum: "04", title: "Cairan CSF", page: "14", pageInChap: 14 },
    ]
  },
  {
    chapId: 2,
    num: "02",
    title: "Meretas Pikiran Bawah Sadar\n& Reprogramming Nasib",
    pageStart: "16",
    subitems: [
      { subNum: "01", title: "Meretas Pikiran Bawah Sadar", page: "16", pageInChap: 1 },
      { subNum: "02", title: "Zona Theta & Critical Faculty", page: "20", pageInChap: 5 },
      { subNum: "03", title: "4 Gerbang Reprogramming Bawah Sadar", page: "24", pageInChap: 9 },
      { subNum: "04", title: "Jeda 3 Detik yang Mengubah Takdir", page: "28", pageInChap: 13 },
    ]
  },
  {
    chapId: 3,
    num: "03",
    title: "Sistem Hormon,\nBiohacking Leluhur",
    pageStart: "31",
    subitems: [
      { subNum: "01", title: "Sistem Hormon & Biohacking Leluhur", page: "31", pageInChap: 1 },
      { subNum: "02", title: "Dopamin Baseline & Reset Reseptor", page: "35", pageInChap: 5 },
      { subNum: "03", title: "Ritme Sirkadian & Melatonin Otak", page: "40", pageInChap: 10 },
      { subNum: "04", title: "Puasa Weton sebagai Teknologi Biologis", page: "43", pageInChap: 13 },
    ]
  },
  {
    chapId: 4,
    num: "04",
    title: "Fisika Kuantum,\nRelativitas & Keterhubungan",
    pageStart: "46",
    subitems: [
      { subNum: "01", title: "Keterhubungan Kuantum & Medan Semesta", page: "46", pageInChap: 1 },
      { subNum: "02", title: "Relativitas Waktu & Dimensi Batin", page: "50", pageInChap: 5 },
      { subNum: "03", title: "Titik Nol (Suwung) sebagai Realitas Sejati", page: "55", pageInChap: 10 },
    ]
  },
  {
    chapId: 5,
    num: "05",
    title: "Menjadi Manusia Normal &\nSeni Berserah",
    pageStart: "60",
    subitems: [
      { subNum: "01", title: "Menjadi Manusia Normal yang Sadar Utuh", page: "60", pageInChap: 1 },
      { subNum: "02", title: "Anti Spiritual Bypass & Menembus Fisik", page: "64", pageInChap: 5 },
      { subNum: "03", title: "Protokol Seni Berserah & Ketenangan", page: "70", pageInChap: 11 },
    ]
  },
];

export class TocScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-toc";
    this.el.style.background = "#0A0A08";

    const blocksHTML = TOC_BREAKDOWN.map((ch, idx) => {
      // Bab 01 open by default (like mockup), others closed
      const isInitialOpen = idx === 0;
      const subitemsRows = ch.subitems.map(sub => `
        <div class="toc-subitem-row" data-chap="${ch.chapId}" data-page="${sub.pageInChap}" style="display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0; cursor: pointer; transition: color 0.15s ease;">
          <span style="display: flex; align-items: baseline; gap: 12px; flex: 1; padding-right: 12px;">
            <span style="font-family: var(--sans); font-size: 12px; color: rgba(235, 226, 214, 0.45); font-weight: 500; width: 20px; flex-shrink: 0;">${sub.subNum}</span>
            <span class="sub-title-text" style="font-family: var(--serif); font-size: 14.5px; color: #EDE4D8; line-height: 1.35;">${sub.title}</span>
          </span>
          <span style="font-family: var(--sans); font-size: 12px; color: rgba(235, 226, 214, 0.45); font-weight: 400; flex-shrink: 0;">${sub.page}</span>
        </div>
      `).join("");

      return `
        <div class="toc-accordion-block ${isInitialOpen ? 'open' : ''}" style="border-bottom: 1px solid rgba(235, 226, 214, 0.08); padding: 18px 0;">
          <!-- Accordion Header -->
          <div class="toc-accordion-header" style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; user-select: none;">
            <div>
              <div style="font-family: var(--sans); font-size: 10px; letter-spacing: 2px; color: #9E8062; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
                BAB ${ch.num}
              </div>
              <div style="font-family: var(--serif); font-size: 17.5px; font-weight: 500; line-height: 1.25; color: #EDE4D8; white-space: pre-line;">
                ${ch.title}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; padding-top: 4px;">
              <span class="toc-page-badge" style="font-family: var(--sans); font-size: 13px; color: rgba(235, 226, 214, 0.45); ${isInitialOpen ? 'display: none;' : ''}">${ch.pageStart}</span>
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

        <!-- PENUTUP ROW -->
        <div class="toc-penutup-item" style="border-bottom: 1px solid rgba(235, 226, 214, 0.08); padding: 18px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
          <div>
            <div style="font-family: var(--serif); font-size: 17.5px; font-weight: 500; color: #EDE4D8; letter-spacing: 0.5px;">PENUTUP</div>
          </div>
          <span style="font-family: var(--sans); font-size: 13px; color: rgba(235, 226, 214, 0.45);">74</span>
        </div>

        <!-- Total Page Counter -->
        <div style="text-align: left; font-family: var(--sans); font-size: 10.5px; color: rgba(235, 226, 214, 0.35); padding: 24px 0 32px; letter-spacing: 0.3px;">
          Total 74 halaman
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

    // Subitem Click Navigation
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

    // Penutup Click
    this.el.querySelector(".toc-penutup-item")?.addEventListener("click", () => {
      navigate("read", { chap: 5, page: 15 });
    });
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
