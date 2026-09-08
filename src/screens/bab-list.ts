/**
 * SUATU SAAT v2 — Screen: Unified Daftar Bab & Daftar Isi (TOC)
 * Combines Chapter Cards (with Illustrations) and Expandable Dropdown TOC per Chapter.
 */
import { CHAPTERS, PAGES, Page, ChapterMeta } from "../data/book";
import { navigate, Route } from "../router";
import { playPaperRustle } from "../lib/audio";
import { PagePicker } from "../components/page-picker";

export class BabListScreen {
  private el: HTMLElement;
  private openChapterIds: Set<number> = new Set(); // All chapters closed by default
  private activeTab: "chapters" | "bookmarks" = "chapters";
  private pagePicker: PagePicker;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-bab";
    this.el.style.background = "#0A0A08";
    this.el.style.width = "100%";
    this.el.style.height = "100%";
    this.el.style.overflow = "hidden";
    this.el.style.display = "flex";
    this.el.style.flexDirection = "column";

    container.appendChild(this.el);

    this.pagePicker = new PagePicker({
      container: this.el,
      onSelectPage: (globalIndex: number) => {
        const page = PAGES[globalIndex];
        if (page) {
          playPaperRustle();
          navigate("read", { chap: page.chapter_id, page: page.page_in_chap });
        }
      },
      onNavigate: (route) => navigate(route),
    });

    this.render();
  }

  public show(route?: Route): void {
    this.pagePicker.close();
    this.el.classList.add("active");
    if (route?.params?.tab === "bookmarks") {
      this.activeTab = "bookmarks";
    } else {
      this.activeTab = "chapters";
    }
    this.openChapterIds.clear(); // Ensure all chapters are closed so user sees all chapters
    this.render();
  }

  public hide(): void {
    this.pagePicker.close();
    this.el.classList.remove("active");
  }

  private toggleChapter(chapId: number): void {
    if (this.openChapterIds.has(chapId)) {
      this.openChapterIds.delete(chapId);
    } else {
      this.openChapterIds.add(chapId);
    }
    this.render();
  }

  private render(): void {
    // Load Bookmarks from localStorage
    let bookmarkedIndices: number[] = [];
    try {
      const saved = localStorage.getItem("suatu_saat_bookmarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          bookmarkedIndices = parsed
            .filter(idx => typeof idx === "number" && idx >= 0 && idx < PAGES.length)
            .sort((a, b) => a - b);
        }
      }
    } catch (_) {}

    const chapters = CHAPTERS.filter(ch => ch.id >= 1 && ch.id <= 5);

    const cardsHTML = chapters.map(ch => {
      const isOpen = this.openChapterIds.has(ch.id);
      const chapPages = PAGES.filter(p => p.chapter_id === ch.id);

      // Generate rows for every page in this chapter
      const pagesRowsHTML = chapPages.map(page => {
        const pInChapStr = page.page_in_chap < 10 ? `0${page.page_in_chap}` : `${page.page_in_chap}`;
        const pGlobalStr = page.page_number < 10 ? `0${page.page_number}` : `${page.page_number}`;

        return `
          <div class="dropdown-page-row" data-chap="${ch.id}" data-page="${page.page_in_chap}">
            <div class="dropdown-page-left">
              <span class="dropdown-page-num-badge">${pInChapStr}</span>
              <div class="dropdown-page-text-wrap">
                <div class="dropdown-page-badge">${page.badge}</div>
                <div class="dropdown-page-title">${page.title}</div>
              </div>
            </div>
            <div class="dropdown-page-right">
              <span class="dropdown-page-global">Hal ${pGlobalStr}</span>
              <span class="dropdown-page-chevron">›</span>
            </div>
          </div>
        `;
      }).join("");

      return `
        <div class="unified-bab-card ${isOpen ? 'open' : ''}" data-chap="${ch.id}">
          <!-- Header Banner (Artwork on Right + Text Centered on Left + Dropdown Cue Below) -->
          <div class="unified-bab-header" data-chap="${ch.id}">
            <!-- Left Info (Centered: Code, Title, Dropdown Cue) -->
            <div class="unified-bab-left">
              <div class="unified-bab-code">${ch.code}</div>
              <div class="unified-bab-title">${ch.title}</div>
              <div class="unified-bab-dropdown-cue">
                <span class="cue-text">${isOpen ? 'Tutup' : 'Lihat isi'}</span>
                <span class="cue-chevron"></span>
              </div>
            </div>

            <!-- Right Illustration Plate with Fade Mask (100% Clean) -->
            <div class="unified-bab-right-artwork">
              <img src="${ch.image}" alt="${ch.code}" loading="lazy" />
              <div class="artwork-mask"></div>
            </div>
          </div>

          <!-- Expandable Dropdown TOC Body -->
          <div class="unified-bab-dropdown">
            <div class="dropdown-quick-bar">
              <span class="dropdown-quick-title">15 halaman di bab ini</span>
              <button class="dropdown-read-all-btn" data-chap="${ch.id}" data-page="1">
                Mulai Bab →
              </button>
            </div>
            <div class="dropdown-pages-list">
              ${pagesRowsHTML}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bookmarks Content HTML
    let bookmarksContentHTML = "";
    if (bookmarkedIndices.length === 0) {
      bookmarksContentHTML = `
        <div class="toc-bookmarks-empty" style="text-align: center; padding: 44px 20px 32px; display: flex; flex-direction: column; align-items: center;">
          <div style="font-size: 36px; color: #C5A059; margin-bottom: 12px; opacity: 0.85;">🔖</div>
          <h3 style="font-family: var(--serif); font-size: 19px; color: #F4EFE6; margin: 0 0 8px; font-weight: 600;">Belum Ada Lembaran Ditandai</h3>
          <p style="font-family: var(--serif); font-size: 13px; line-height: 1.6; color: #A89886; max-width: 290px; margin: 0 0 22px;">
            Ketuk ikon <span style="color: #C5A059; font-weight: 600;">🔖</span> di pojok kanan atas saat membaca untuk menyimpan halaman favoritmu di sini.
          </p>
          <button type="button" class="btn-primary" id="btn-empty-start" style="background: #C5A059; color: #11110F; max-width: 200px; padding: 12px 20px; font-size: 13px; font-weight: 600; border-radius: 12px;">
            Mulai Membaca →
          </button>
        </div>
      `;
    } else {
      const itemsHTML = bookmarkedIndices.map(idx => {
        const p = PAGES[idx];
        if (!p) return "";
        const pInChap = p.page_in_chap < 10 ? `0${p.page_in_chap}` : `${p.page_in_chap}`;
        const pGlobal = p.page_number < 10 ? `0${p.page_number}` : `${p.page_number}`;
        const quote = p.side_a_text ? `"${p.side_a_text}"` : (p.teaser || "");

        return `
          <div class="toc-bookmark-card" data-chap="${p.chapter_id}" data-page="${p.page_in_chap}" role="button" tabindex="0">
            <div class="toc-bookmark-thumb-wrap">
              <img src="${p.thumbnail || p.image_path}" alt="${p.title}" class="toc-bookmark-thumb" loading="lazy" />
            </div>
            <div class="toc-bookmark-info">
              <div class="toc-bookmark-meta">
                <span class="toc-bookmark-chap-badge">BAB ${p.chapter_id}</span>
                <span class="toc-bookmark-page-num">Hal ${pGlobal} (${pInChap})</span>
              </div>
              <div class="toc-bookmark-title">${p.title}</div>
              ${quote ? `<p class="toc-bookmark-quote">${quote}</p>` : ''}
            </div>
            <div class="toc-bookmark-arrow">›</div>
          </div>
        `;
      }).join("");

      bookmarksContentHTML = `
        <div class="toc-bookmarks-list">
          ${itemsHTML}
        </div>
      `;
    }

    this.el.innerHTML = `
      <!-- Top Header Navigation -->
      <header class="ph-header" style="padding: 16px 20px 10px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
        <div class="back-btn" id="unified-btn-back" style="cursor: pointer; font-family: var(--sans); font-size: 12.5px; color: rgba(235, 226, 214, 0.7); display: flex; align-items: center; gap: 6px;">
          <span>←</span>
          <span>Sampul</span>
        </div>
        <div class="brand" id="unified-btn-home" role="button" tabindex="0" title="Kembali ke Beranda" style="cursor: pointer; font-family: var(--serif); font-size: 16px; letter-spacing: 2px; color: #EDE4D8; font-weight: 500; transition: opacity 0.2s ease;">
          SUATU SAAT
        </div>
        <span class="m-hdr-page" id="unified-hdr-page" role="button" tabindex="0" title="Pilih Halaman" style="cursor: pointer; font-family: var(--sans); font-size: 11px; color: #C5A059; font-weight: 500; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 3px; padding: 4px 6px; border-radius: 6px; transition: color 0.2s, background 0.2s;">
          <span>74 hal</span>
          <span style="font-size: 9px; opacity: 0.7;">▾</span>
        </span>
      </header>

      <!-- Sub Header Title Row -->
      <div style="max-width: 480px; width: 100%; margin: 0 auto; padding: 6px 20px 10px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <h1 style="font-family: var(--serif); font-size: 24px; letter-spacing: 1px; color: #EDE4D8; font-weight: 500; line-height: 1.15; margin: 0;">
            ${this.activeTab === 'bookmarks' ? 'Lembaran Ditandai' : 'Daftar Isi'}
          </h1>
        </div>
        <button id="unified-btn-help" style="background: rgba(197, 160, 89, 0.12); border: 1px solid rgba(197, 160, 89, 0.35); color: #C5A059; border-radius: 999px; padding: 5px 12px; font-family: var(--sans); font-size: 11px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s ease;">
          <span>Petunjuk</span>
          <span style="font-weight: 700; font-size: 12px;">?</span>
        </button>
      </div>

      <!-- Segmented Tab Bar (Semua Bab vs Lembaran Ditandai) -->
      <div style="max-width: 480px; width: 100%; margin: 0 auto 12px; padding: 0 16px; box-sizing: border-box;">
        <div class="toc-tab-bar">
          <button type="button" class="toc-tab-btn ${this.activeTab === 'chapters' ? 'active' : ''}" id="btn-toc-tab-chapters">
            <span>Semua Bab (5)</span>
          </button>
          <button type="button" class="toc-tab-btn ${this.activeTab === 'bookmarks' ? 'active' : ''}" id="btn-toc-tab-bookmarks">
            <span>★ Ditandai</span>
            ${bookmarkedIndices.length > 0 ? `<span class="toc-tab-count">${bookmarkedIndices.length}</span>` : ''}
          </button>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <main class="unified-bab-scroll" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 20px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 12px;">
        ${this.activeTab === 'chapters' ? `
          <!-- Prolog Card (Fixed Top) -->
          <div class="unified-bab-card" id="card-prolog" style="cursor: pointer;">
            <div class="unified-bab-header" style="cursor: pointer;">
              <div class="unified-bab-left">
                <div class="unified-bab-code" style="color: #C5A059; font-weight: 700;">PROLOG</div>
                <div class="unified-bab-title">Obrolan di Pinggir Jalan</div>
                <div class="unified-bab-dropdown-cue">
                  <span class="cue-text">Buka Prolog →</span>
                </div>
              </div>
              <div class="unified-bab-right-artwork">
                <img src="/assets/prolog_warkop.jpg" alt="Prolog" loading="lazy" />
                <div class="artwork-mask"></div>
              </div>
            </div>
          </div>

          ${cardsHTML}

          <!-- Epilog Card (Fixed Bottom) -->
          <div class="unified-bab-card" id="card-epilog" style="cursor: pointer;">
            <div class="unified-bab-header" style="cursor: pointer;">
              <div class="unified-bab-left">
                <div class="unified-bab-code" style="color: #C5A059; font-weight: 700;">EPILOG</div>
                <div class="unified-bab-title">Menjadi Manusia Normal</div>
                <div class="unified-bab-dropdown-cue">
                  <span class="cue-text">Buka Epilog →</span>
                </div>
              </div>
              <div class="unified-bab-right-artwork">
                <img src="/assets/epilog_keluarga.jpg" alt="Epilog" loading="lazy" />
                <div class="artwork-mask"></div>
              </div>
            </div>
          </div>

          <!-- Total summary footer -->
          <div style="text-align: center; font-family: var(--sans); font-size: 10.5px; color: rgba(235, 226, 214, 0.4); padding: 16px 0 8px; letter-spacing: 0.5px;">
            Prolog · 5 Bab · 74 Halaman · Epilog
          </div>
        ` : `
          ${bookmarksContentHTML}
        `}
      </main>

      <!-- Bottom Sticky CTA -->
      <footer style="padding: 10px 20px 16px; max-width: 480px; width: 100%; margin: 0 auto; background: linear-gradient(180deg, transparent 0%, #0A0A08 40%); z-index: 10;">
        <button class="btn-primary" id="btn-start-reading" style="background: #C5A059; color: #11110F; border: none; padding: 14px 20px; border-radius: 12px; font-family: var(--sans); font-size: 14px; font-weight: 600; letter-spacing: 0.3px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-shadow: 0 8px 24px rgba(197, 160, 89, 0.35);">
          ${this.activeTab === 'bookmarks' && bookmarkedIndices.length > 0 
            ? 'Buka Lembaran Terakhir Ditandai →' 
            : 'Mulai Membaca dari Prolog →'}
        </button>
      </footer>
    `;

    // Bind DOM Events
    this.bindEvents(bookmarkedIndices);
  }

  private bindEvents(bookmarkedIndices: number[] = []): void {
    // Back to Cover
    this.el.querySelector("#unified-btn-back")?.addEventListener("click", () => {
      this.pagePicker.close();
      navigate("cover");
    });

    // Brand SUATU SAAT -> Back to Cover
    this.el.querySelector("#unified-btn-home")?.addEventListener("click", () => {
      this.pagePicker.close();
      navigate("cover");
    });

    // Page Jumper (74 hal ▾) -> Toggle PagePicker Popover
    this.el.querySelector("#unified-hdr-page")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.pagePicker.toggle(0);
    });

    // Tab Switcher Buttons
    this.el.querySelector("#btn-toc-tab-chapters")?.addEventListener("click", () => {
      if (this.activeTab !== "chapters") {
        this.activeTab = "chapters";
        this.render();
      }
    });

    this.el.querySelector("#btn-toc-tab-bookmarks")?.addEventListener("click", () => {
      if (this.activeTab !== "bookmarks") {
        this.activeTab = "bookmarks";
        this.render();
      }
    });

    // Empty state start reading button
    this.el.querySelector("#btn-empty-start")?.addEventListener("click", () => {
      playPaperRustle();
      navigate("read", { chap: 1, page: 1 });
    });

    // Bookmark cards click -> navigate directly to bookmarked page
    this.el.querySelectorAll(".toc-bookmark-card").forEach(card => {
      card.addEventListener("click", () => {
        const chapId = parseInt(card.getAttribute("data-chap") || "1", 10);
        const pageNum = parseInt(card.getAttribute("data-page") || "1", 10);
        playPaperRustle();
        navigate("read", { chap: chapId, page: pageNum });
      });
    });

    // Prolog and Epilog Cards
    this.el.querySelector("#card-prolog")?.addEventListener("click", () => {
      playPaperRustle();
      navigate("prolog");
    });

    this.el.querySelector("#card-epilog")?.addEventListener("click", () => {
      playPaperRustle();
      navigate("epilog");
    });

    // Bottom Sticky Start Reading CTA
    this.el.querySelector("#btn-start-reading")?.addEventListener("click", () => {
      playPaperRustle();
      if (this.activeTab === "bookmarks" && bookmarkedIndices.length > 0) {
        const lastBookmarkedIdx = bookmarkedIndices[bookmarkedIndices.length - 1];
        const lastPage = PAGES[lastBookmarkedIdx];
        if (lastPage) {
          navigate("read", { chap: lastPage.chapter_id, page: lastPage.page_in_chap });
          return;
        }
      }
      navigate("prolog");
    });

    // Petunjuk Membaca (?) -> Trigger reader tutorial on demand
    this.el.querySelector("#unified-btn-help")?.addEventListener("click", () => {
      try {
        sessionStorage.removeItem("suatu-saat:reader-tutorial-completed");
        sessionStorage.setItem("suatu-saat:reader-tutorial-force", "true");
      } catch (_) {}
      playPaperRustle();
      navigate("read", { chap: 1, page: 1 });
    });

    // Accordion Toggle on clicking header or toggle chevron
    this.el.querySelectorAll(".unified-bab-header").forEach(header => {
      header.addEventListener("click", (e) => {
        // If user clicked the read button inside header, don't toggle
        const target = e.target as HTMLElement;
        if (target.closest(".dropdown-read-all-btn")) return;

        const card = header.closest(".unified-bab-card") as HTMLElement;
        if (!card) return;
        const chapId = parseInt(header.getAttribute("data-chap") || "1", 10);

        card.classList.toggle("open");
        const isOpenNow = card.classList.contains("open");
        if (isOpenNow) {
          this.openChapterIds.add(chapId);
        } else {
          this.openChapterIds.delete(chapId);
        }

        const cueText = card.querySelector(".cue-text");
        const cueChevron = card.querySelector(".cue-chevron");
        if (cueText) cueText.textContent = isOpenNow ? "Tutup" : "Lihat isi";
        if (cueChevron) cueChevron.textContent = "";
      });
    });

    // Read Chapter from start button inside dropdown
    this.el.querySelectorAll(".dropdown-read-all-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const chapId = parseInt(btn.getAttribute("data-chap") || "1", 10);
        playPaperRustle();
        navigate("read", { chap: chapId, page: 1 });
      });
    });

    // Click on individual page row in TOC dropdown
    this.el.querySelectorAll(".dropdown-page-row").forEach(row => {
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        const chapId = parseInt(row.getAttribute("data-chap") || "1", 10);
        const pageNum = parseInt(row.getAttribute("data-page") || "1", 10);
        playPaperRustle();
        navigate("read", { chap: chapId, page: pageNum });
      });
    });
  }
}
