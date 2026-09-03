/**
 * SUATU SAAT v2 — Flipbook Reader with Peek Drawer (Bottom Sheet)
 * Mobile (<= 480px, Target: 390px): 9:16 Portrait Hero Poster + Warm Bone Paper Editorial Peek Drawer
 * Desktop (> 480px): Open-Book Two-Page Physical Spread
 */
import { PAGES, Page } from "../../data/book";
import { navigate, Route } from "../../router";
import { playPageTurn, playPaperSlide } from "../../lib/audio";
import { attachGestures, attachKeyboardNav } from "../../lib/gestures";

export class ReaderScreen {
  private el: HTMLElement;
  private currentGlobalIndex = 0; // 0..73
  private activeSide: "A" | "B" = "A";
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
    this.activeSide = "A"; // Reset to Side A (Visual reveal)
    this.render();
  }

  public hide(): void {
    this.el.classList.remove("active");
  }

  public goToPage(index: number, direction?: "next" | "prev"): void {
    if (index < 0 || index >= PAGES.length || index === this.currentGlobalIndex) return;
    if (this.isFlipping) return;

    const dir = direction ?? (index > this.currentGlobalIndex ? "next" : "prev");
    this.isFlipping = true;
    playPageTurn();

    const isMobile = window.innerWidth <= 480;

    if (isMobile) {
      const posterBox = this.el.querySelector(".m-poster-box") as HTMLElement;
      if (posterBox) {
        posterBox.classList.add(dir === "next" ? "m-flip-out-next" : "m-flip-out-prev");
      }

      setTimeout(() => {
        this.currentGlobalIndex = index;
        this.activeSide = "A"; // Page navigation resets to Side A visual
        this.render();

        const newPosterBox = this.el.querySelector(".m-poster-box") as HTMLElement;
        if (newPosterBox) {
          newPosterBox.classList.add(dir === "next" ? "m-flip-in-next" : "m-flip-in-prev");
          setTimeout(() => {
            newPosterBox.classList.remove("m-flip-in-next", "m-flip-in-prev");
            this.isFlipping = false;
          }, 300);
        } else {
          this.isFlipping = false;
        }
      }, 160);
    } else {
      // Desktop Book Spread 3D Curl
      const bookSpread = this.el.querySelector(".physical-book-spread") as HTMLElement;
      if (bookSpread) {
        bookSpread.classList.add(dir === "next" ? "d-flip-out-next" : "d-flip-out-prev");
      }

      setTimeout(() => {
        this.currentGlobalIndex = index;
        this.render();

        const newBookSpread = this.el.querySelector(".physical-book-spread") as HTMLElement;
        if (newBookSpread) {
          newBookSpread.classList.add(dir === "next" ? "d-flip-in-next" : "d-flip-in-prev");
          setTimeout(() => {
            newBookSpread.classList.remove("d-flip-in-next", "d-flip-in-prev");
            this.isFlipping = false;
          }, 300);
        } else {
          this.isFlipping = false;
        }
      }, 160);
    }
  }

  public nextPage(): void {
    if (this.currentGlobalIndex < PAGES.length - 1) {
      this.goToPage(this.currentGlobalIndex + 1, "next");
    }
  }

  public prevPage(): void {
    if (this.currentGlobalIndex > 0) {
      this.goToPage(this.currentGlobalIndex - 1, "prev");
    }
  }

  public flipToSide(side: "A" | "B"): void {
    if (this.activeSide === side || this.isFlipping) return;
    this.isFlipping = true;
    this.activeSide = side;
    playPaperSlide();

    const sheetContainer = this.el.querySelector(".m-sheet-container");
    if (sheetContainer) {
      if (side === "B") {
        sheetContainer.classList.remove("side-a-active");
        sheetContainer.classList.add("side-b-active");
      } else {
        sheetContainer.classList.remove("side-b-active");
        sheetContainer.classList.add("side-a-active");
      }
    }

    setTimeout(() => {
      this.isFlipping = false;
    }, 380);
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
      <div class="mobile-reader-shell">
        <div class="m-sheet-container ${this.activeSide === 'B' ? 'side-b-active' : 'side-a-active'}">
          <!-- ========================================================= -->
          <!-- SIDE A: VISUAL FACE (Hero Poster 9:16 Uncropped + Tap to Flip) -->
          <!-- ========================================================= -->
          <div class="m-sheet-face m-face-a" id="m-face-a">
            <!-- Header Bar -->
            <header class="mobile-reader-header m-header-a">
              <button class="m-hdr-btn" id="m-btn-menu-a" aria-label="Daftar Bab & Isi">
                <span class="m-icon">☰</span>
              </button>
              <div class="m-hdr-title" id="m-hdr-title" role="button" tabindex="0" title="Kembali ke Beranda">Suatu Saat</div>
              <div class="m-hdr-right" style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: var(--sans); font-size: 11px; color: rgba(235, 226, 214, 0.6); font-weight: 500;">
                  ${curNum} / ${totalNum}
                </span>
                <button class="m-hdr-btn ${isBookmarked ? 'bookmarked' : ''}" id="m-btn-bookmark-a" aria-label="Simpan Penanda">
                  <span class="m-icon">${isBookmarked ? '★' : '🔖'}</span>
                </button>
              </div>
            </header>

            <!-- Visual Stage (Tap anywhere to flip to Side B) -->
            <main class="m-visual-stage" id="m-stage-a">
              <div class="m-poster-box" id="m-poster-box">
                <img
                  src="${page.image_path}"
                  alt="${page.title}"
                  class="m-poster-img"
                  loading="eager"
                />

                <!-- Floating Chevrons: Left (<) and Right (>) -->
                <button class="m-chevron m-chevron-prev ${isFirst ? 'disabled' : ''}" id="m-btn-prev-a" aria-label="Halaman Sebelumnya">
                  <span>‹</span>
                </button>
                <button class="m-chevron m-chevron-next ${isLast ? 'disabled' : ''}" id="m-btn-next-a" aria-label="Halaman Selanjutnya">
                  <span>›</span>
                </button>
              </div>

              <!-- Subtle Flip Cue -->
              <div class="m-flip-hint-pill" id="m-btn-flip-cue">
                <span class="m-hint-icon">↺</span>
                <span class="m-hint-text">Ketuk poster untuk membaca naskah</span>
              </div>
            </main>
          </div>

          <!-- ========================================================= -->
          <!-- SIDE B: READING FACE (Warm Bone Paper + Editorial Measure) -->
          <!-- ========================================================= -->
          <div class="m-sheet-face m-face-b" id="m-face-b">
            <!-- Header Bar (Mirrors Side A) -->
            <header class="mobile-reader-header m-header-b">
              <button class="m-hdr-btn" id="m-btn-menu-b" aria-label="Daftar Bab & Isi" style="color: #4A3A2A;">
                <span class="m-icon">☰</span>
              </button>
              <div class="m-hdr-title" id="m-hdr-title-b" role="button" tabindex="0" title="Kembali ke Beranda" style="cursor: pointer; color: #1E1A16;">Suatu Saat</div>
              <div class="m-hdr-right" style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: var(--sans); font-size: 11px; color: #7A6045; font-weight: 600;">
                  ${curNum} / ${totalNum}
                </span>
                <button class="m-hdr-btn ${isBookmarked ? 'bookmarked' : ''}" id="m-btn-bookmark-b" aria-label="Simpan Penanda" style="color: #7A6045;">
                  <span class="m-icon">${isBookmarked ? '★' : '🔖'}</span>
                </button>
              </div>
            </header>

            <!-- Floating Chevrons: Left (<) and Right (>) matching Side A -->
            <button class="m-chevron m-chevron-prev ${isFirst ? 'disabled' : ''}" id="m-btn-prev-b" aria-label="Halaman Sebelumnya">
              <span>‹</span>
            </button>
            <button class="m-chevron m-chevron-next ${isLast ? 'disabled' : ''}" id="m-btn-next-b" aria-label="Halaman Selanjutnya">
              <span>›</span>
            </button>

            <!-- Reading Body Stage (Tap anywhere to flip back to Side A) -->
            <main class="m-reading-stage" id="m-reading-stage" style="cursor: pointer; position: relative;">
              <div class="m-reading-container">
                <!-- Article Header -->
                <header class="m-article-header">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span class="m-hdr-b-chip">${page.chapter_code}</span>
                    <span style="font-family: var(--sans); font-size: 10px; font-weight: 600; letter-spacing: 1px; color: #7A6045;">HALAMAN ${curNum}</span>
                  </div>
                  <h1 class="m-article-title">${page.title}</h1>
                  ${page.subtitle ? `<div class="m-article-subtitle">${page.subtitle}</div>` : ''}
                  <div class="m-article-ornament">✧ ─── ✧</div>
                </header>

                <!-- Full Paragraphs & Quotes (text-align: left, generous measure) -->
                <div class="m-editorial-body">
                  ${parasHTML}
                </div>

                <!-- Clean Editorial End Marker (stepper & duplicate page count removed) -->
                <footer class="m-reading-footer" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(122, 96, 69, 0.18); text-align: center; padding-bottom: 36px;">
                  <div class="m-reading-footer-brand">SUATU SAAT · KESADARAN NUSANTARA</div>
                </footer>
              </div>
            </main>

            <!-- Subtle Flip Cue Pill -->
            <div class="m-flip-hint-pill m-flip-hint-pill-b" id="m-btn-flip-cue-b">
              <span class="m-hint-icon">↺</span>
              <span class="m-hint-text">Ketuk naskah untuk kembali ke visual</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Mobile DOM Events
    this.bindMobileEvents();
  }

  private bindMobileEvents(): void {
    // Menu (TOC / Bab List) from Side A and Side B
    this.el.querySelector("#m-btn-menu-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("bab");
    });
    this.el.querySelector("#m-btn-menu-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("bab");
    });

    // "Suatu Saat" in navbar -> Navigate back to homepage
    this.el.querySelector("#m-hdr-title")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("cover");
    });
    this.el.querySelector("#m-hdr-title-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("cover");
    });

    // Bookmarks on Side A and Side B
    this.el.querySelector("#m-btn-bookmark-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleBookmark();
    });
    this.el.querySelector("#m-btn-bookmark-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleBookmark();
    });

    // Side A Chevrons (Previous / Next page)
    this.el.querySelector("#m-btn-prev-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.prevPage();
    });
    this.el.querySelector("#m-btn-next-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextPage();
    });

    // Side B Chevrons (Previous / Next page)
    this.el.querySelector("#m-btn-prev-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.prevPage();
    });
    this.el.querySelector("#m-btn-next-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextPage();
    });

    // Side A Flip Trigger (Tap poster stage or hint cue to flip to Side B)
    const stageA = this.el.querySelector("#m-stage-a");
    stageA?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".m-chevron")) return;
      this.flipToSide("B");
    });

    // Side B Flip Trigger (Tap reading stage to flip back to Side A)
    const stageB = this.el.querySelector("#m-reading-stage");
    stageB?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".m-chevron") || target.closest("button") || target.closest("a")) return;
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) return;
      this.flipToSide("A");
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
          <div style="display: flex; align-items: center; gap: 14px;">
            <div id="d-hdr-title" role="button" tabindex="0" title="Kembali ke Beranda" style="cursor: pointer; font-family: var(--serif); font-size: 15px; letter-spacing: 1.5px; color: #EDE4D8; font-weight: 500; transition: opacity 0.2s ease;">
              SUATU SAAT
            </div>
            <span style="opacity: 0.25; font-size: 12px; color: #EDE4D8;">|</span>
            <div class="back-btn" id="d-back-btn" style="cursor: pointer; font-family: var(--sans); font-size: 12.5px; color: rgba(235, 226, 214, 0.7); display: flex; align-items: center; gap: 6px;">
              <span>← Kembali ke Bab</span>
            </div>
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
    this.el.querySelector("#d-hdr-title")?.addEventListener("click", () => navigate("cover"));
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
