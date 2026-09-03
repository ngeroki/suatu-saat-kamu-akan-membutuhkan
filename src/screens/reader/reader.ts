/**
 * SUATU SAAT v2 — Flipbook Reader with Peek Drawer (Bottom Sheet)
 * Mobile (<= 480px, Target: 390px): 9:16 Portrait Hero Poster + Warm Bone Paper Editorial Peek Drawer
 * Desktop (> 480px): Open-Book Two-Page Physical Spread
 */
import { PAGES, Page } from "../../data/book";
import { navigate, Route } from "../../router";
import { playPaperRustle } from "../../lib/audio";
import { attachGestures, attachKeyboardNav } from "../../lib/gestures";

export class ReaderScreen {
  private el: HTMLElement;
  private currentGlobalIndex = 0; // 0..73
  private drawerExpanded = false;
  private bookmarkedPages: Set<number> = new Set();
  private isFlipping = false;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-reader";
    this.el.style.width = "100%";
    this.el.style.height = "100%";
    this.el.style.overflow = "hidden";
    this.el.style.display = "flex";
    this.el.style.flexDirection = "column";

    container.appendChild(this.el);

    // Gestures for swipe navigation (left / right for page turns)
    attachGestures(this.el, {
      onSwipeLeft: () => this.nextPage(),
      onSwipeRight: () => this.prevPage(),
    });

    // Keyboard navigation (arrow keys)
    attachKeyboardNav(
      () => this.prevPage(),
      () => this.nextPage()
    );

    // Re-render when window is resized across breakpoints
    window.addEventListener("resize", () => {
      if (this.el.classList.contains("active")) {
        this.render();
      }
    });
  }

  public show(route?: Route): void {
    this.el.classList.add("active");

    const requestedChap = route?.params.chap ?? 1;
    const requestedPageInChap = route?.params.page ?? 1;

    const matchIndex = PAGES.findIndex(
      p => p.chapter_id === requestedChap && p.page_in_chap === requestedPageInChap
    );

    this.currentGlobalIndex = matchIndex >= 0 ? matchIndex : 0;
    this.drawerExpanded = false; // Reset to peek view so user sees the hero artwork first
    this.render();
  }

  public hide(): void {
    this.el.classList.remove("active");
  }

  public goToPage(index: number): void {
    if (index < 0 || index >= PAGES.length || index === this.currentGlobalIndex) return;
    if (this.isFlipping) return;

    this.isFlipping = true;
    playPaperRustle();
    this.currentGlobalIndex = index;
    this.drawerExpanded = false; // Collapse to peek mode on new page
    this.render();

    setTimeout(() => {
      this.isFlipping = false;
    }, 200);
  }

  public nextPage(): void {
    if (this.currentGlobalIndex < PAGES.length - 1) {
      this.goToPage(this.currentGlobalIndex + 1);
    }
  }

  public prevPage(): void {
    if (this.currentGlobalIndex > 0) {
      this.goToPage(this.currentGlobalIndex - 1);
    }
  }

  public toggleDrawer(): void {
    this.drawerExpanded = !this.drawerExpanded;
    this.render();
  }

  public setDrawerState(expanded: boolean): void {
    if (this.drawerExpanded === expanded) return;
    this.drawerExpanded = expanded;
    this.render();
  }

  public toggleBookmark(): void {
    if (this.bookmarkedPages.has(this.currentGlobalIndex)) {
      this.bookmarkedPages.delete(this.currentGlobalIndex);
    } else {
      this.bookmarkedPages.add(this.currentGlobalIndex);
    }
    this.render();
  }

  private render(): void {
    const isMobile = window.innerWidth <= 480;
    const page = PAGES[this.currentGlobalIndex];
    if (!page) return;

    if (isMobile) {
      this.renderMobile(page);
    } else {
      this.renderDesktop(page);
    }
  }

  // =========================================================================
  // MOBILE PEEK-DRAWER RENDERER (<= 480px, Target: 390px)
  // =========================================================================
  private renderMobile(page: Page): void {
    const isBookmarked = this.bookmarkedPages.has(this.currentGlobalIndex);
    const curNum = this.currentGlobalIndex + 1;
    const totalNum = PAGES.length;
    const progressPercent = ((curNum - 1) / Math.max(1, totalNum - 1)) * 100;
    const isFirst = this.currentGlobalIndex === 0;
    const isLast = this.currentGlobalIndex >= PAGES.length - 1;

    this.el.style.background = "#0A0A08";
    this.el.style.color = "#EDE4D8";

    // Group quotes and citations together cleanly
    const elements: string[] = [];
    let i = 0;
    while (i < page.paragraphs.length) {
      const p = page.paragraphs[i];
      const isQuote = p.startsWith('"') || p.startsWith('“') || p.startsWith("'");
      const nextP = i + 1 < page.paragraphs.length ? page.paragraphs[i + 1] : "";
      const nextIsCitation = nextP.startsWith("—") || nextP.startsWith("~") || nextP.startsWith("-");

      if (isQuote) {
        let citationHTML = "";
        if (nextIsCitation) {
          citationHTML = `<cite class="m-quote-citation">${nextP}</cite>`;
          i++; // Consume citation paragraph
        }
        elements.push(`
          <blockquote class="m-editorial-quote">
            <p class="m-quote-text">${p}</p>
            ${citationHTML}
          </blockquote>
        `);
      } else {
        if (elements.length === 0 && p.length > 20) {
          const firstChar = p.charAt(0);
          const rest = p.slice(1);
          elements.push(`
            <p class="m-editorial-p">
              <span class="m-dropcap">${firstChar}</span>${rest}
            </p>
          `);
        } else {
          elements.push(`<p class="m-editorial-p">${p}</p>`);
        }
      }
      i++;
    }
    const parasHTML = elements.join("");

    this.el.innerHTML = `
      <div class="mobile-reader-shell ${this.drawerExpanded ? 'drawer-is-expanded' : 'drawer-is-collapsed'}">
        <!-- 1. Header Bar (Menu ☰ | Suatu Saat | Bookmark 🔖) -->
        <header class="mobile-reader-header">
          <button class="m-hdr-btn" id="m-btn-menu" aria-label="Daftar Bab & Isi">
            <span class="m-icon">☰</span>
          </button>
          <div class="m-hdr-title">Suatu Saat</div>
          <div class="m-hdr-right" style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: var(--sans); font-size: 11px; color: rgba(235, 226, 214, 0.6); font-weight: 500;">
              ${curNum} / ${totalNum}
            </span>
            <button class="m-hdr-btn ${isBookmarked ? 'bookmarked' : ''}" id="m-btn-bookmark" aria-label="Simpan Penanda">
              <span class="m-icon">${isBookmarked ? '★' : '🔖'}</span>
            </button>
          </div>
        </header>

        <!-- 2. Hero Visual Stage (Poster 9:16 Contain) -->
        <main class="m-visual-stage" id="m-visual-stage">
          <div class="m-poster-box">
            <img
              src="${page.image_path}"
              alt="${page.title}"
              class="m-poster-img"
              loading="eager"
            />

            <!-- Floating Chevrons: Left (<) and Right (>) -->
            <button class="m-chevron m-chevron-prev ${isFirst ? 'disabled' : ''}" id="m-btn-prev" aria-label="Halaman Sebelumnya">
              <span>‹</span>
            </button>
            <button class="m-chevron m-chevron-next ${isLast ? 'disabled' : ''}" id="m-btn-next" aria-label="Halaman Selanjutnya">
              <span>›</span>
            </button>
          </div>
        </main>

        <!-- 3. Peek Drawer (Warm Bone Paper Bottom Sheet) -->
        <div class="m-peek-drawer ${this.drawerExpanded ? 'expanded' : 'collapsed'}" id="m-peek-drawer">
          <!-- When Expanded: Top Bar with Chapter/Page Badge + Close Button -->
          <div class="m-drawer-top-bar" id="m-drawer-top-bar">
            <div class="m-drawer-chip">
              <span class="chip-code">${page.chapter_code}</span>
              <span class="chip-sep">·</span>
              <span class="chip-page">HAL ${curNum} / ${totalNum}</span>
            </div>
            <div class="m-drawer-pill-handle"></div>
            <button class="m-drawer-close-btn" id="m-btn-close-drawer" aria-label="Tutup naskah">
              <span>Tutup ✕</span>
            </button>
          </div>

          <!-- When Collapsed: Minimal Peek Header Bar -->
          <div class="m-drawer-peek-header" id="m-drawer-peek-header">
            <div class="m-drawer-pill-handle"></div>
            <div class="m-drawer-action-hint">
              <span>BACA NASKAH LENGKAP ▴</span>
            </div>
          </div>

          <!-- Scrollable Drawer Body Content -->
          <div class="m-drawer-body" id="m-drawer-body">
            <!-- Article Header -->
            <header class="m-article-header">
              <h1 class="m-article-title">${page.title}</h1>
              ${page.subtitle ? `<div class="m-article-subtitle">${page.subtitle}</div>` : ''}
              <div class="m-article-ornament">✧ ─── ✧</div>
            </header>

            <!-- Full Paragraphs & Quotes -->
            <div class="m-editorial-body">
              ${parasHTML}
            </div>

            <!-- Bottom Progress in Drawer -->
            <footer class="m-drawer-footer">
              <div class="m-drawer-footer-brand">SUATU SAAT · KESADARAN NUSANTARA</div>
              <div class="m-drawer-progress-wrap">
                <button class="m-stepper-btn ${isFirst ? 'disabled' : ''}" id="m-btn-prev-naskah" aria-label="Sebelumnya">‹</button>
                <div class="m-stepper-label">${curNum} / ${totalNum}</div>
                <div class="m-progress-track naskah-track" id="m-progress-track">
                  <div class="m-progress-fill naskah-fill" style="width: ${progressPercent}%;">
                    <div class="m-progress-dot naskah-dot"></div>
                  </div>
                </div>
                <button class="m-stepper-btn ${isLast ? 'disabled' : ''}" id="m-btn-next-naskah" aria-label="Selanjutnya">›</button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    `;

    // Bind Mobile DOM Events
    this.bindMobileEvents();
  }

  private bindMobileEvents(): void {
    // Menu (TOC / Bab List)
    this.el.querySelector("#m-btn-menu")?.addEventListener("click", () => navigate("bab"));

    // Bookmark Toggle
    this.el.querySelector("#m-btn-bookmark")?.addEventListener("click", () => this.toggleBookmark());

    // Navigation buttons
    this.el.querySelector("#m-btn-prev")?.addEventListener("click", () => this.prevPage());
    this.el.querySelector("#m-btn-next")?.addEventListener("click", () => this.nextPage());
    this.el.querySelector("#m-btn-prev-naskah")?.addEventListener("click", () => this.prevPage());
    this.el.querySelector("#m-btn-next-naskah")?.addEventListener("click", () => this.nextPage());

    // Close button on expanded top bar
    this.el.querySelector("#m-btn-close-drawer")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setDrawerState(false);
    });

    // Toggle drawer on clicking top bar in expanded mode
    this.el.querySelector("#m-drawer-top-bar")?.addEventListener("click", () => {
      this.setDrawerState(false);
    });

    // Expand drawer on clicking peek header
    this.el.querySelector("#m-drawer-peek-header")?.addEventListener("click", () => {
      this.setDrawerState(true);
    });

    // Clicking anywhere on the peek drawer when collapsed will expand it
    const peekDrawer = this.el.querySelector("#m-peek-drawer") as HTMLElement;
    peekDrawer?.addEventListener("click", () => {
      if (!this.drawerExpanded) {
        this.setDrawerState(true);
      }
    });

    // Touch gesture on the drawer handle: swipe up to expand, swipe down to collapse
    const handleElements = [
      this.el.querySelector("#m-drawer-top-bar"),
      this.el.querySelector("#m-drawer-peek-header")
    ];

    handleElements.forEach(headerEl => {
      let touchStartY = 0;
      headerEl?.addEventListener("touchstart", (e: any) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      headerEl?.addEventListener("touchend", (e: any) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        if (deltaY < -30 && !this.drawerExpanded) {
          this.setDrawerState(true);
        } else if (deltaY > 30 && this.drawerExpanded) {
          this.setDrawerState(false);
        }
      }, { passive: true });
    });

    // Interactive progress track click
    const trackBar = this.el.querySelector("#m-progress-track") as HTMLElement;
    trackBar?.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      const rect = trackBar.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetIndex = Math.round(clickRatio * (PAGES.length - 1));
      this.goToPage(targetIndex);
    });
  }

  // =========================================================================
  // DESKTOP OPEN-BOOK TWO-PAGE SPREAD RENDERER (> 480px)
  // =========================================================================
  private renderDesktop(page: Page): void {
    this.el.style.background = "#0A0A08";
    this.el.style.color = "#EDE4D8";

    const curNum = this.currentGlobalIndex + 1;
    const totalNum = PAGES.length;
    const pStr = page.page_in_chap < 10 ? `0${page.page_in_chap}` : `${page.page_in_chap}`;
    const percent = ((curNum - 1) / Math.max(1, totalNum - 1)) * 100;

    // Group quotes and citations together cleanly for desktop
    const dElements: string[] = [];
    let dIdx = 0;
    while (dIdx < page.paragraphs.length) {
      const p = page.paragraphs[dIdx];
      const isQuote = p.startsWith('"') || p.startsWith('“') || p.startsWith("'");
      const nextP = dIdx + 1 < page.paragraphs.length ? page.paragraphs[dIdx + 1] : "";
      const nextIsCitation = nextP.startsWith("—") || nextP.startsWith("~") || nextP.startsWith("-");

      if (isQuote) {
        let citationHTML = "";
        if (nextIsCitation) {
          citationHTML = `<div style="margin-top: 6px; font-family: var(--sans); font-size: 9px; font-weight: 600; letter-spacing: 0.8px; color: #7A6045; text-transform: uppercase;">${nextP}</div>`;
          dIdx++;
        }
        dElements.push(`
          <blockquote style="border-left: 2.5px solid #8F7645; padding: 8px 12px; margin: 8px 0; font-family: var(--serif); font-style: italic; font-size: 13px; color: #2C251D; line-height: 1.55; background: rgba(122,96,69,0.06); border-radius: 0 4px 4px 0;">
            <p style="margin: 0;">${p}</p>
            ${citationHTML}
          </blockquote>
        `);
      } else {
        if (dElements.length === 0 && p.length > 20) {
          const firstLetter = p.charAt(0);
          const rest = p.slice(1);
          dElements.push(`<p style="margin-bottom: 8px; font-family: var(--serif); font-size: 13px; line-height: 1.6; color: #1D1A16; text-align: justify;"><span style="float: left; font-family: var(--display); font-size: 32px; line-height: 0.82; font-weight: 700; color: #7A6045; margin-right: 6px; padding-top: 2px;">${firstLetter}</span>${rest}</p>`);
        } else {
          dElements.push(`<p style="margin-bottom: 8px; font-family: var(--serif); font-size: 13px; line-height: 1.6; color: #1D1A16; text-align: justify;">${p}</p>`);
        }
      }
      dIdx++;
    }
    const parasHTML = dElements.join("");

    this.el.innerHTML = `
      <div class="desktop-reader-shell" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding-bottom: 8px;">
        <!-- Top Bar -->
        <div class="ph-header" style="padding: 16px 24px 8px; max-width: 900px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
          <div class="back-btn" id="d-back-btn" style="cursor: pointer; font-family: var(--sans); font-size: 12.5px; color: rgba(235, 226, 214, 0.7); display: flex; align-items: center; gap: 6px;">
            <span>← Kembali ke Bab</span>
          </div>
          <div style="font-family: var(--sans); font-size: 13.5px; letter-spacing: 1.5px; color: #EDE4D8; font-weight: 500; text-transform: uppercase;">
            ${page.chapter_code}
          </div>
          <div style="font-family: var(--sans); font-size: 13px; color: rgba(235, 226, 214, 0.7); letter-spacing: 0.5px;">
            ${curNum} / ${totalNum}
          </div>
        </div>

        <!-- 3D Open-Book Physical Spread -->
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 4px 14px 10px; max-width: 900px; width: 100%; margin: 0 auto; position: relative;">
          <div class="physical-book-spread" style="display: flex; width: 100%; height: 100%; max-height: 560px; border-radius: 6px; overflow: visible; box-shadow: -10px 25px 60px -10px rgba(0,0,0,0.85), 10px 25px 60px -10px rgba(0,0,0,0.85); position: relative;">
            <!-- LEFT PAGE: Bone Paper Typography -->
            <div class="spread-page-left" style="flex: 1; background: #F4EFE6; color: #1A1714; padding: 18px 18px 14px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: inset -18px 0 25px -10px rgba(0,0,0,0.2); border-left: 2px solid #C4B9A7; border-top-left-radius: 5px; border-bottom-left-radius: 5px; overflow: hidden;">
              <div style="flex: 1; overflow-y: auto; padding-right: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; border-bottom: 1px solid rgba(122,96,69,0.18); padding-bottom: 4px;">
                  <span style="font-family: var(--sans); font-size: 9px; font-weight: 600; letter-spacing: 1.5px; color: #7A6045; text-transform: uppercase;">
                    ${page.chapter_code}
                  </span>
                  <span style="font-family: var(--display); font-size: 20px; font-weight: 600; color: #161513; line-height: 1;">
                    ${pStr}
                  </span>
                </div>
                <h2 style="font-family: var(--serif); font-size: 15.5px; font-weight: 700; color: #161310; line-height: 1.28; margin: 4px 0 2px 0;">
                  ${page.title}
                </h2>
                ${page.subtitle ? `<div style="font-family: var(--serif); font-size: 12px; font-style: italic; color: #554737; line-height: 1.38; margin-bottom: 6px;">${page.subtitle}</div>` : ''}
                <div style="font-family: var(--serif); color: #1D1A16; margin-top: 6px;">
                  ${parasHTML}
                </div>
              </div>
              <div style="font-family: var(--sans); font-size: 8.5px; letter-spacing: 1.5px; color: #7A6045; text-transform: uppercase; font-weight: 600; padding-top: 6px; border-top: 1px solid rgba(122,96,69,0.15); margin-top: 4px; flex-shrink: 0; display: flex; justify-content: space-between;">
                <span>SUATU SAAT</span>
                <span style="letter-spacing: 0.5px; opacity: 0.7;">HAL ${curNum} / ${totalNum}</span>
              </div>
            </div>

            <!-- CENTER GUTTER -->
            <div style="width: 3px; background: linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1), rgba(0,0,0,0.4)); box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 5; flex-shrink: 0;"></div>

            <!-- RIGHT PAGE: Artwork (Uncropped 9:16 Portrait) -->
            <div class="spread-page-right" style="flex: 1; position: relative; overflow: hidden; background: #0E0D0B; box-shadow: inset 18px 0 25px -10px rgba(0,0,0,0.45); border-top-right-radius: 5px; border-bottom-right-radius: 5px; display: flex; align-items: center; justify-content: center; padding: 12px;">
              <img
                src="${page.image_path}"
                alt="${page.title}"
                style="max-width: 100%; max-height: 100%; aspect-ratio: 9 / 16; object-fit: contain; border-radius: 4px; box-shadow: 0 6px 24px rgba(0,0,0,0.75); display: block;"
              />
            </div>
          </div>
        </div>

        <!-- Desktop Bottom Controls -->
        <div style="max-width: 600px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; z-index: 10;">
          <div class="nav-track-bar" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 4px 20px;">
            <div class="nav-circle" id="d-btn-prev" style="${this.currentGlobalIndex <= 0 ? 'opacity: 0.3; pointer-events: none;' : ''}">←</div>
            <div class="nav-track" id="d-nav-track" style="flex: 1; height: 2px; background: rgba(235, 226, 214, 0.15); position: relative; border-radius: 1px; cursor: pointer;">
              <div style="position: absolute; top: 50%; left: ${percent}%; width: 12px; height: 12px; border-radius: 50%; background: #D1B498; transform: translate(-50%, -50%); box-shadow: 0 0 10px rgba(209, 180, 152, 0.6); transition: left 0.2s ease;"></div>
            </div>
            <div class="nav-circle" id="d-btn-next" style="${this.currentGlobalIndex >= totalNum - 1 ? 'opacity: 0.3; pointer-events: none;' : ''}">→</div>
          </div>

          <div class="tab-bar" style="display: flex; justify-content: space-around; align-items: center; padding: 10px 24px 4px; border-top: 1px solid rgba(235, 226, 214, 0.1);">
            <div class="tab-item" id="d-btn-toc" style="cursor: pointer;">
              <span style="font-size: 17px; line-height: 1;">☰</span>
              <span style="font-family: var(--sans); font-size: 10px;">Daftar Isi</span>
            </div>
            <div class="tab-item" id="d-btn-fullscreen" style="cursor: pointer;">
              <span style="font-size: 16px; line-height: 1;">⛶</span>
              <span style="font-family: var(--sans); font-size: 10px;">Layar Penuh</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Desktop DOM Events
    this.el.querySelector("#d-back-btn")?.addEventListener("click", () => navigate("bab"));
    this.el.querySelector("#d-btn-toc")?.addEventListener("click", () => navigate("toc"));
    this.el.querySelector("#d-btn-prev")?.addEventListener("click", () => this.prevPage());
    this.el.querySelector("#d-btn-next")?.addEventListener("click", () => this.nextPage());
    this.el.querySelector("#d-btn-fullscreen")?.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    const dTrack = this.el.querySelector("#d-nav-track") as HTMLElement;
    dTrack?.addEventListener("click", (e: MouseEvent) => {
      const rect = dTrack.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetIndex = Math.round(clickRatio * (PAGES.length - 1));
      this.goToPage(targetIndex);
    });
  }
}
