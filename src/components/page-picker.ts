/**
 * SUATU SAAT v2 — Component: PagePicker Popover
 * Direct Top-Right Instant Page Jumper (Frameless & Soft Ambient Elevation)
 */
import { PAGES, CHAPTERS, Page } from "../data/book";
import { RouteName } from "../router";

export interface PagePickerOptions {
  container: HTMLElement;
  onSelectPage: (globalIndex: number) => void;
  onNavigate: (route: RouteName) => void;
}

export class PagePicker {
  private container: HTMLElement;
  private onSelectPage: (globalIndex: number) => void;
  private onNavigate: (route: RouteName) => void;

  private overlayEl: HTMLElement | null = null;
  private activeChapterId = 1;
  private currentGlobalIndex = 0;
  private isOpen = false;
  private viewingBookmarks = false;

  constructor(options: PagePickerOptions) {
    this.container = options.container;
    this.onSelectPage = options.onSelectPage;
    this.onNavigate = options.onNavigate;

    // Listen to Escape key globally to close popover
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  public get opened(): boolean {
    return this.isOpen;
  }

  public toggle(currentGlobalIndex: number): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(currentGlobalIndex);
    }
  }

  public open(currentGlobalIndex: number): void {
    this.currentGlobalIndex = currentGlobalIndex;
    const curPage: Page | undefined = PAGES[currentGlobalIndex];
    this.activeChapterId = curPage ? curPage.chapter_id : 1;
    this.viewingBookmarks = false;
    this.isOpen = true;

    this.closeDomImmediate();

    const overlay = document.createElement("div");
    overlay.id = "page-picker-overlay";
    overlay.className = "page-picker-overlay";

    this.overlayEl = overlay;
    this.renderBase();
    this.container.appendChild(overlay);

    // Auto-focus input without forcing zoom on mobile
    const inputEl = overlay.querySelector("#picker-input-page") as HTMLInputElement;
    if (inputEl) {
      inputEl.select();
    }
  }

  public close(): void {
    if (!this.isOpen || !this.overlayEl) return;
    this.isOpen = false;

    const overlay = this.overlayEl;
    overlay.classList.add("closing");
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (this.overlayEl === overlay) {
        this.overlayEl = null;
      }
    }, 160);
  }

  private closeDomImmediate(): void {
    const existing = this.container.querySelector("#page-picker-overlay");
    if (existing) {
      existing.remove();
    }
    this.overlayEl = null;
  }

  private renderBase(): void {
    if (!this.overlayEl) return;

    const curNum = this.currentGlobalIndex + 1;
    const totalNum = PAGES.length;

    this.overlayEl.innerHTML = `
      <div class="picker-backdrop" id="picker-backdrop"></div>
      <div class="picker-popover-card" role="dialog" aria-modal="true" aria-label="Lompat Halaman">
        <!-- Header -->
        <div class="picker-card-header">
          <span class="picker-card-title">Lompat ke Halaman</span>
          <button id="picker-close-btn" class="picker-btn-close" aria-label="Tutup">✕</button>
        </div>

        <!-- Direct Number Input -->
        <div class="picker-input-row">
          <div class="picker-input-box" id="picker-input-box">
            <span class="picker-input-prefix">Hal</span>
            <input
              id="picker-input-page"
              type="number"
              min="1"
              max="${totalNum}"
              value="${curNum}"
              class="picker-input-field"
              placeholder="1-${totalNum}"
            />
            <span class="picker-input-suffix">/ ${totalNum}</span>
          </div>
          <button id="picker-btn-go" class="picker-btn-go">
            Loncat
          </button>
        </div>

        <!-- Chapter Filter Tabs Row -->
        <div class="picker-meta-row">
          <span class="picker-meta-label" id="picker-meta-label">Pilih Langsung</span>
          <span class="picker-meta-chapter" id="picker-chapter-info"></span>
        </div>
        <div class="picker-tabs-row" id="picker-tabs-container"></div>

        <!-- Direct 5-Column Page Numbers Grid or Bookmarks List -->
        <div class="picker-grid" id="picker-grid-container"></div>
      </div>
    `;

    // Bind Base Events
    this.overlayEl.querySelector("#picker-backdrop")?.addEventListener("click", () => this.close());
    this.overlayEl.querySelector("#picker-close-btn")?.addEventListener("click", () => this.close());

    const inputEl = this.overlayEl.querySelector("#picker-input-page") as HTMLInputElement;
    const btnGo = this.overlayEl.querySelector("#picker-btn-go");
    const inputBox = this.overlayEl.querySelector("#picker-input-box");

    const handleJump = () => {
      if (!inputEl) return;
      const target = parseInt(inputEl.value, 10);
      if (!isNaN(target) && target >= 1 && target <= PAGES.length) {
        this.close();
        this.onSelectPage(target - 1);
      } else {
        // Subtle visual shake indication on invalid input
        if (inputBox) {
          inputBox.classList.add("picker-input-error");
          setTimeout(() => inputBox.classList.remove("picker-input-error"), 400);
        }
      }
    };

    btnGo?.addEventListener("click", handleJump);
    inputEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleJump();
      }
    });

    // Populate Dynamic Chapter Tabs and Pages Grid
    this.updateChapterContent();
  }

  /**
   * Smoothly updates chapter tabs, page grid, or bookmarks WITHOUT re-rendering the outer card.
   * This prevents animation flickering and preserves user input field values.
   */
  private updateChapterContent(): void {
    if (!this.overlayEl) return;

    const metaLabel = this.overlayEl.querySelector("#picker-meta-label");
    const chapterInfo = this.overlayEl.querySelector("#picker-chapter-info");
    const tabsContainer = this.overlayEl.querySelector("#picker-tabs-container");
    const contentContainer = this.overlayEl.querySelector("#picker-grid-container");

    const chapter = CHAPTERS.find(c => c.id === this.activeChapterId) || CHAPTERS[0];
    const chapPages = PAGES.filter(p => p.chapter_id === this.activeChapterId);
    const curNum = this.currentGlobalIndex + 1;

    // Render Chapter & Quick Tabs Pills
    if (tabsContainer) {
      tabsContainer.innerHTML = [
        `<button class="picker-quick-tab" data-nav="prolog">Prolog</button>`,
        ...CHAPTERS.map(ch => {
          const isActive = !this.viewingBookmarks && ch.id === this.activeChapterId;
          const label = ch.code.replace("BAB 0", "Bab ").replace("BAB ", "Bab ");
          return `
            <button class="picker-chap-tab ${isActive ? 'active' : ''}" data-chap="${ch.id}">
              ${label}
            </button>
          `;
        }),
        `<button class="picker-quick-tab" data-nav="epilog">Epilog</button>`,
        `<button class="picker-quick-tab picker-bookmark-tab ${this.viewingBookmarks ? 'active' : ''}" data-nav="bookmarks">★ Penanda</button>`
      ].join("");

      // Bind Chapter Tab Handlers
      tabsContainer.querySelectorAll(".picker-chap-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
          e.stopPropagation();
          const cid = parseInt((tab as HTMLElement).dataset.chap || "1", 10);
          this.viewingBookmarks = false;
          if (this.activeChapterId !== cid) {
            this.activeChapterId = cid;
          }
          this.updateChapterContent();
        });
      });

      // Bind Quick Tab Handlers (including bookmarks)
      tabsContainer.querySelectorAll(".picker-quick-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
          e.stopPropagation();
          const nav = (tab as HTMLElement).dataset.nav;
          if (nav === "bookmarks") {
            this.viewingBookmarks = true;
            this.updateChapterContent();
            return;
          }
          this.close();
          this.onNavigate(nav as RouteName);
        });
      });
    }

    if (this.viewingBookmarks) {
      if (metaLabel) {
        metaLabel.textContent = "Halaman Ditandai";
      }

      let bookmarkedIndices: number[] = [];
      try {
        const saved = localStorage.getItem("suatu_saat_bookmarks");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            bookmarkedIndices = parsed
              .filter((n): n is number => typeof n === "number" && n >= 0 && n < PAGES.length)
              .sort((a, b) => a - b);
          }
        }
      } catch (e) {
        console.warn("Failed to load bookmarks in PagePicker:", e);
      }

      if (chapterInfo) {
        chapterInfo.textContent = bookmarkedIndices.length > 0 ? `${bookmarkedIndices.length} Ditandai` : "";
      }

      if (contentContainer) {
        contentContainer.className = "picker-bookmarks-container";
        if (bookmarkedIndices.length === 0) {
          contentContainer.innerHTML = `
            <div class="picker-bookmarks-empty">
              <div class="picker-bookmarks-empty-icon">🔖</div>
              <p class="picker-bookmarks-empty-text">Belum ada halaman yang ditandai. Ketuk ikon 🔖 saat membaca untuk menyimpan halaman.</p>
            </div>
          `;
        } else {
          contentContainer.innerHTML = `
            <div class="picker-bookmarks-list">
              ${bookmarkedIndices.map(idx => {
                const p = PAGES[idx];
                const isCur = idx === this.currentGlobalIndex;
                return `
                  <button class="picker-bookmark-item ${isCur ? 'current' : ''}" data-idx="${idx}">
                    <span class="picker-bm-star">★</span>
                    <div class="picker-bm-content">
                      <div class="picker-bm-title">Hal ${p.page_number} · [${p.chapter_code}] ${p.title}</div>
                      ${p.subtitle ? `<div class="picker-bm-subtitle">${p.subtitle}</div>` : ''}
                    </div>
                  </button>
                `;
              }).join("")}
            </div>
          `;

          contentContainer.querySelectorAll(".picker-bookmark-item").forEach(item => {
            item.addEventListener("click", (e) => {
              e.stopPropagation();
              const targetIdx = parseInt((item as HTMLElement).dataset.idx || "0", 10);
              this.close();
              this.onSelectPage(targetIdx);
            });
          });
        }
      }
    } else {
      // Standard Chapter Grid View
      if (metaLabel) {
        metaLabel.textContent = "Pilih Langsung";
      }

      if (chapterInfo) {
        chapterInfo.textContent = `${chapter.code} (Hal ${chapter.pageStart} - ${chapter.pageStart + chapter.pageCount - 1})`;
      }

      // Render 5-Column Page Numbers Grid
      if (contentContainer) {
        contentContainer.className = "picker-grid";
        contentContainer.innerHTML = chapPages.map(p => {
          const pNum = p.page_number;
          const isCur = pNum === curNum;
          return `
            <button class="picker-page-btn ${isCur ? 'current' : ''}" data-idx="${pNum - 1}">
              ${pNum}
            </button>
          `;
        }).join("");

        // Bind Page Click Handlers -> 1-Tap Instant Jump!
        contentContainer.querySelectorAll(".picker-page-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const targetIdx = parseInt((btn as HTMLElement).dataset.idx || "0", 10);
            this.close();
            this.onSelectPage(targetIdx);
          });
        });
      }
    }
  }
}
