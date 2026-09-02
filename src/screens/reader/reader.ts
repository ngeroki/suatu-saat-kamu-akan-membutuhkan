/**
 * SUATU SAAT v2 — Authentic 3D Book Spread Reader with Physics Page Curl
 * Modeled after Mobile Legends Hero Mastery / Achievement Book
 * Features:
 *   - Strictly structured 74 pages (1..15 per chapter)
 *   - Unique illustration plate & quote for EVERY page
 *   - 3D perspective physical page flip animation with dynamic lighting
 *   - Authentic multi-layer paper rustle sound
 */
import { BOOK_SPREAD_PAGES, SpreadPage } from "../../data/spread-pages";
import { navigate, Route } from "../../router";
import { playPaperRustle } from "../../lib/audio";
import { attachGestures, attachKeyboardNav } from "../../lib/gestures";

export class ReaderScreen {
  private el: HTMLElement;
  private currentGlobalIndex = 0; // 0..73
  private isImmersive = false;
  private isLargeText = false;
  private isFlipping = false;

  private topBarEl!: HTMLElement;
  private bookSpreadEl!: HTMLElement;
  private navTrackEl!: HTMLElement;
  private dotEl!: HTMLElement;
  private prevBtn!: HTMLElement;
  private nextBtn!: HTMLElement;
  private chapBadgeEl!: HTMLElement;
  private pageCounterEl!: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-reader";
    this.el.style.background = "#0A0A08";
    this.el.style.display = "flex";
    this.el.style.flexDirection = "column";
    this.el.style.justifyContent = "space-between";
    this.el.style.padding = "0 0 8px 0";

    this.el.innerHTML = `
      <!-- 1. Top Header Bar -->
      <div class="ph-header" style="padding: 16px 20px 8px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
        <div class="back-btn" id="reader-back-btn" style="cursor: pointer; font-family: var(--sans); font-size: 12.5px; color: rgba(235, 226, 214, 0.7); display: flex; align-items: center; gap: 6px; letter-spacing: 0.2px;">
          <span style="font-size: 15px;">←</span>
          <span>Kembali ke Bab</span>
        </div>
        <div id="reader-chap-badge" style="font-family: var(--sans); font-size: 13.5px; letter-spacing: 1.5px; color: #EDE4D8; font-weight: 500; text-transform: uppercase;">
          BAB 01
        </div>
        <div id="reader-page-counter" style="font-family: var(--sans); font-size: 13px; color: rgba(235, 226, 214, 0.7); letter-spacing: 0.5px;">
          01 / 15
        </div>
      </div>

      <!-- 2. The Core 3D Book Spread Container -->
      <div id="book-spread-container" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 4px 14px 10px; max-width: 480px; width: 100%; margin: 0 auto; position: relative; perspective: 1800px;">
        <!-- Injected dynamically -->
      </div>

      <!-- 3. Bottom Controls Area -->
      <div style="max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; z-index: 10;">
        <!-- Nav Track (Left circle, line + dot, Right circle) -->
        <div class="nav-track-bar" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 4px 20px 8px;">
          <div class="nav-circle" id="nav-btn-prev" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(235, 226, 214, 0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #EDE4D8; font-size: 18px; background: rgba(18,18,16,0.3); transition: background 0.2s, border-color 0.2s;">
            ←
          </div>
          <div class="nav-track" id="nav-track-bar" style="flex: 1; height: 2px; background: rgba(235, 226, 214, 0.15); position: relative; border-radius: 1px; cursor: pointer;">
            <div id="reader-nav-dot" style="position: absolute; top: 50%; left: 0%; width: 12px; height: 12px; border-radius: 50%; background: #D1B498; transform: translate(-50%, -50%); box-shadow: 0 0 10px rgba(209, 180, 152, 0.6); transition: left 0.25s ease;"></div>
          </div>
          <div class="nav-circle" id="nav-btn-next" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(235, 226, 214, 0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #EDE4D8; font-size: 18px; background: rgba(18,18,16,0.3); transition: background 0.2s, border-color 0.2s;">
            →
          </div>
        </div>

        <!-- 4. Tab Bar (Daftar Isi | Teks | Layar Penuh) -->
        <div class="tab-bar" style="display: flex; justify-content: space-around; align-items: center; padding: 12px 24px 8px; border-top: 1px solid rgba(235, 226, 214, 0.1);">
          <div class="tab-item" id="tab-btn-toc" style="display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: rgba(235, 226, 214, 0.7); transition: color 0.2s;">
            <span style="font-size: 17px; line-height: 1;">☰</span>
            <span style="font-family: var(--sans); font-size: 10px; letter-spacing: 0.2px;">Daftar Isi</span>
          </div>
          <div class="tab-item" id="tab-btn-teks" style="display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: rgba(235, 226, 214, 0.7); transition: color 0.2s;">
            <span style="font-family: var(--serif); font-size: 18px; font-weight: 500; line-height: 1;">Aa</span>
            <span style="font-family: var(--sans); font-size: 10px; letter-spacing: 0.2px;">Teks</span>
          </div>
          <div class="tab-item" id="tab-btn-layar" style="display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: rgba(235, 226, 214, 0.7); transition: color 0.2s;">
            <span style="font-size: 16px; line-height: 1;">⛶</span>
            <span style="font-family: var(--sans); font-size: 10px; letter-spacing: 0.2px;">Layar Penuh</span>
          </div>
        </div>
      </div>
    `;

    container.appendChild(this.el);

    this.bookSpreadEl = this.el.querySelector("#book-spread-container") as HTMLElement;
    this.dotEl = this.el.querySelector("#reader-nav-dot") as HTMLElement;
    this.prevBtn = this.el.querySelector("#nav-btn-prev") as HTMLElement;
    this.nextBtn = this.el.querySelector("#nav-btn-next") as HTMLElement;
    this.chapBadgeEl = this.el.querySelector("#reader-chap-badge") as HTMLElement;
    this.pageCounterEl = this.el.querySelector("#reader-page-counter") as HTMLElement;

    // Attach Event Listeners
    this.el.querySelector("#reader-back-btn")?.addEventListener("click", () => navigate("bab"));
    this.el.querySelector("#tab-btn-toc")?.addEventListener("click", () => navigate("toc"));
    
    this.el.querySelector("#tab-btn-teks")?.addEventListener("click", () => {
      this.isLargeText = !this.isLargeText;
      this.renderCurrentSpread();
    });

    this.el.querySelector("#tab-btn-layar")?.addEventListener("click", () => {
      this.isImmersive = !this.isImmersive;
      this.renderCurrentSpread();
    });

    this.prevBtn.addEventListener("click", () => this.flipPrevWithCurl());
    this.nextBtn.addEventListener("click", () => this.flipNextWithCurl());

    // Track click for direct jump within chapter
    const trackBar = this.el.querySelector("#nav-track-bar") as HTMLElement;
    trackBar?.addEventListener("click", (e: MouseEvent) => {
      const rect = trackBar.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const curPage = BOOK_SPREAD_PAGES[this.currentGlobalIndex];
      const chapPages = BOOK_SPREAD_PAGES.filter(p => p.chapterId === curPage.chapterId);
      const targetInChap = Math.round(clickRatio * (chapPages.length - 1));
      const targetGlobal = chapPages[targetInChap].globalPage - 1;
      if (targetGlobal !== this.currentGlobalIndex) {
        if (targetGlobal > this.currentGlobalIndex) {
          this.flipNextWithCurl(targetGlobal);
        } else {
          this.flipPrevWithCurl(targetGlobal);
        }
      }
    });

    // Gestures & Keyboard navigation
    attachGestures(this.el, {
      onSwipeLeft: () => this.flipNextWithCurl(),
      onSwipeRight: () => this.flipPrevWithCurl(),
    });

    attachKeyboardNav(
      () => this.flipPrevWithCurl(),
      () => this.flipNextWithCurl()
    );
  }

  public show(route?: Route): void {
    this.el.classList.add("active");

    const requestedChap = route?.params.chap ?? 1;
    const requestedPageInChap = route?.params.page ?? 1;

    // Find exact page in BOOK_SPREAD_PAGES
    const matchIndex = BOOK_SPREAD_PAGES.findIndex(
      p => p.chapterId === requestedChap && p.pageInChap === requestedPageInChap
    );

    this.currentGlobalIndex = matchIndex >= 0 ? matchIndex : 0;
    this.renderCurrentSpread();
  }

  public hide(): void {
    this.el.classList.remove("active");
  }

  /**
   * 3D Physics Page Curl Animation (Next)
   */
  private flipNextWithCurl(targetIndex?: number): void {
    if (this.isFlipping) return;
    const nextIdx = targetIndex !== undefined ? targetIndex : this.currentGlobalIndex + 1;
    if (nextIdx >= BOOK_SPREAD_PAGES.length) return;

    this.isFlipping = true;
    playPaperRustle();

    const book = this.bookSpreadEl.querySelector(".physical-book-spread") as HTMLElement;
    if (!book) {
      this.currentGlobalIndex = nextIdx;
      this.renderCurrentSpread();
      this.isFlipping = false;
      return;
    }

    const curPage = BOOK_SPREAD_PAGES[this.currentGlobalIndex];
    const nextPage = BOOK_SPREAD_PAGES[nextIdx];

    // Create 3D flipping sheet element over the right page
    const flipSheet = document.createElement("div");
    flipSheet.className = "flipping-sheet-3d";
    flipSheet.style.cssText = `
      position: absolute;
      top: 0; right: 0; bottom: 0; width: 50%;
      transform-origin: left center;
      transform-style: preserve-3d;
      z-index: 20;
      pointer-events: none;
      transition: transform 0.52s cubic-bezier(0.25, 1, 0.35, 1);
    `;

    // Front of sheet (Current right image turning over)
    const frontFace = document.createElement("div");
    frontFace.style.cssText = `
      position: absolute; inset: 0;
      backface-visibility: hidden;
      overflow: hidden;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      box-shadow: inset 15px 0 25px -10px rgba(0,0,0,0.4);
    `;
    frontFace.innerHTML = `
      <img src="${curPage.image}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);"></div>
      <div style="position: absolute; bottom: 20px; left: 16px; right: 16px;">
        <div style="font-family: var(--serif); font-size: 13px; font-style: italic; line-height: 1.45; color: #FFFFFF;">
          "${curPage.quote}"
        </div>
      </div>
    `;

    // Back of sheet (Parchment reverse side folding onto left)
    const backFace = document.createElement("div");
    backFace.style.cssText = `
      position: absolute; inset: 0;
      backface-visibility: hidden;
      transform: rotateY(180deg);
      background: #DDD4C6;
      box-shadow: inset -15px 0 25px -10px rgba(0,0,0,0.3);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      display: flex; align-items: center; justify-content: center;
    `;
    backFace.innerHTML = `
      <div style="opacity: 0.15; font-family: var(--serif); font-size: 28px; letter-spacing: 2px; color: #141310;">
        SUATU SAAT
      </div>
    `;

    flipSheet.appendChild(frontFace);
    flipSheet.appendChild(backFace);
    book.appendChild(flipSheet);

    // Pre-render the upcoming next page underneath right page
    const rightPageEl = book.querySelector(".spread-page-right") as HTMLElement;
    if (rightPageEl) {
      rightPageEl.innerHTML = `
        <img src="${nextPage.image}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);"></div>
        <div style="position: absolute; bottom: 20px; left: 16px; right: 16px; z-index: 3;">
          <div style="font-family: var(--serif); font-size: 13px; font-style: italic; line-height: 1.45; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.95);">
            "${nextPage.quote}"
          </div>
        </div>
      `;
    }

    // Trigger 3D turn animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flipSheet.style.transform = "rotateY(-180deg)";
      });
    });

    // Settle after animation
    setTimeout(() => {
      flipSheet.remove();
      this.currentGlobalIndex = nextIdx;
      this.renderCurrentSpread();
      this.isFlipping = false;
    }, 530);
  }

  /**
   * 3D Physics Page Curl Animation (Prev)
   */
  private flipPrevWithCurl(targetIndex?: number): void {
    if (this.isFlipping) return;
    const prevIdx = targetIndex !== undefined ? targetIndex : this.currentGlobalIndex - 1;
    if (prevIdx < 0) return;

    this.isFlipping = true;
    playPaperRustle();

    const book = this.bookSpreadEl.querySelector(".physical-book-spread") as HTMLElement;
    if (!book) {
      this.currentGlobalIndex = prevIdx;
      this.renderCurrentSpread();
      this.isFlipping = false;
      return;
    }

    const prevPage = BOOK_SPREAD_PAGES[prevIdx];

    // Create 3D flipping sheet element starting from left page
    const flipSheet = document.createElement("div");
    flipSheet.className = "flipping-sheet-3d-prev";
    flipSheet.style.cssText = `
      position: absolute;
      top: 0; left: 0; bottom: 0; width: 50%;
      transform-origin: right center;
      transform-style: preserve-3d;
      z-index: 20;
      pointer-events: none;
      transition: transform 0.52s cubic-bezier(0.25, 1, 0.35, 1);
    `;

    // Front of sheet (Current left page turning back)
    const frontFace = document.createElement("div");
    frontFace.style.cssText = `
      position: absolute; inset: 0;
      backface-visibility: hidden;
      background: #E2D9CC;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      padding: 24px 18px 18px;
      display: flex; flex-direction: column; justify-content: space-between;
      box-shadow: inset -15px 0 25px -10px rgba(0,0,0,0.22);
    `;
    const curPage = BOOK_SPREAD_PAGES[this.currentGlobalIndex];
    frontFace.innerHTML = `
      <div>
        <div style="font-family: var(--serif); font-size: 32px; font-weight: 500; color: #161513; margin-bottom: 12px;">${curPage.pageNumberDisplay}</div>
        <div style="font-family: var(--serif); font-size: 16px; font-weight: 500; line-height: 1.25; color: #161513; margin-bottom: 14px;">${curPage.title}</div>
      </div>
      <div style="font-family: var(--sans); font-size: 9px; letter-spacing: 1.5px; color: #7A6045;">SUATU SAAT</div>
    `;

    // Back of sheet (Artwork of prev page landing on right)
    const backFace = document.createElement("div");
    backFace.style.cssText = `
      position: absolute; inset: 0;
      backface-visibility: hidden;
      transform: rotateY(-180deg);
      overflow: hidden;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    `;
    backFace.innerHTML = `
      <img src="${prevPage.image}" style="width: 100%; height: 100%; object-fit: cover;">
    `;

    flipSheet.appendChild(frontFace);
    flipSheet.appendChild(backFace);
    book.appendChild(flipSheet);

    // Pre-render previous page content onto left page underneath
    const leftPageEl = book.querySelector(".spread-page-left") as HTMLElement;
    if (leftPageEl) {
      leftPageEl.innerHTML = `
        <div>
          <div style="font-family: var(--serif); font-size: 32px; font-weight: 500; color: #161513; margin-bottom: 12px;">${prevPage.pageNumberDisplay}</div>
          <div style="font-family: var(--serif); font-size: 16px; font-weight: 500; line-height: 1.25; color: #161513; margin-bottom: 14px;">${prevPage.title}</div>
          <div style="font-family: var(--serif); font-size: 12px; line-height: 1.55; color: #2C2822;">
            ${prevPage.paragraphs.map(p => `<p style="margin-bottom: 8px;">${p}</p>`).join("")}
          </div>
        </div>
        <div style="font-family: var(--sans); font-size: 9px; letter-spacing: 1.5px; color: #7A6045;">SUATU SAAT</div>
      `;
    }

    // Trigger turn back
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flipSheet.style.transform = "rotateY(180deg)";
      });
    });

    // Settle after animation
    setTimeout(() => {
      flipSheet.remove();
      this.currentGlobalIndex = prevIdx;
      this.renderCurrentSpread();
      this.isFlipping = false;
    }, 530);
  }

  private renderCurrentSpread(): void {
    const page = BOOK_SPREAD_PAGES[this.currentGlobalIndex];
    if (!page) return;

    // Update Top Chrome Header
    this.chapBadgeEl.textContent = page.chapterNum;
    const pStr = page.pageInChap < 10 ? `0${page.pageInChap}` : `${page.pageInChap}`;
    const totStr = page.totalInChap < 10 ? `0${page.totalInChap}` : `${page.totalInChap}`;
    this.pageCounterEl.textContent = `${pStr} / ${totStr}`;

    // Update Nav Track Slider within Chapter
    const chapPages = BOOK_SPREAD_PAGES.filter(p => p.chapterId === page.chapterId);
    const chapIndex = chapPages.findIndex(p => p.globalPage === page.globalPage);
    const percent = ((chapIndex) / Math.max(1, chapPages.length - 1)) * 100;
    this.dotEl.style.left = `${percent}%`;

    // Button states
    if (this.currentGlobalIndex <= 0) {
      this.prevBtn.style.opacity = "0.3";
      this.prevBtn.style.pointerEvents = "none";
    } else {
      this.prevBtn.style.opacity = "1";
      this.prevBtn.style.pointerEvents = "auto";
    }

    if (this.currentGlobalIndex >= BOOK_SPREAD_PAGES.length - 1) {
      this.nextBtn.style.opacity = "0.3";
      this.nextBtn.style.pointerEvents = "none";
    } else {
      this.nextBtn.style.opacity = "1";
      this.nextBtn.style.pointerEvents = "auto";
    }

    // Render Book Spread (or Immersive Mode)
    if (this.isImmersive) {
      this.bookSpreadEl.innerHTML = `
        <div style="width: 100%; height: 100%; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          <img src="${page.image}" alt="${page.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(10,10,8,0.85) 100%);"></div>
          <div style="position: absolute; bottom: 24px; left: 24px; right: 24px;">
            <div style="font-family: var(--serif); font-size: 20px; color: #FFFFFF; font-style: italic; line-height: 1.4; text-shadow: 0 2px 8px rgba(0,0,0,0.8);">
              "${page.quote}"
            </div>
            <div style="font-family: var(--sans); font-size: 11px; letter-spacing: 1.5px; color: rgba(235, 226, 214, 0.7); text-transform: uppercase; margin-top: 10px;">
              ${page.chapterTitle} · HAL ${page.pageNumberDisplay} / ${page.totalInChap}
            </div>
          </div>
        </div>
      `;
    } else {
      // Authentic 3D Book Spread (Matches Mockup 100%)
      const bodyFontSize = this.isLargeText ? "13.5px" : "12px";
      const titleFontSize = this.isLargeText ? "18px" : "16px";
      const numberFontSize = this.isLargeText ? "36px" : "32px";

      this.bookSpreadEl.innerHTML = `
        <div class="physical-book-spread" style="display: flex; width: 100%; height: 100%; max-height: 520px; border-radius: 6px; overflow: visible; box-shadow: 0 25px 60px -10px rgba(0,0,0,0.85), 0 10px 25px rgba(0,0,0,0.6); position: relative;">
          <!-- LEFT PAGE: Bone Paper Typography -->
          <div class="spread-page-left" style="flex: 1; background: #E2D9CC; color: #161513; padding: 24px 18px 18px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: inset -15px 0 25px -10px rgba(0,0,0,0.22); border-top-left-radius: 4px; border-bottom-left-radius: 4px; overflow: hidden;">
            <div>
              <!-- Big Page Number -->
              <div style="font-family: var(--serif); font-size: ${numberFontSize}; font-weight: 500; color: #161513; line-height: 1; margin-bottom: 12px;">
                ${page.pageNumberDisplay}
              </div>

              <!-- Page Title -->
              <div style="font-family: var(--serif); font-size: ${titleFontSize}; font-weight: 500; line-height: 1.25; color: #161513; white-space: pre-line; margin-bottom: 16px;">
                ${page.title}
              </div>

              <!-- Paragraphs -->
              <div style="font-family: var(--serif); font-size: ${bodyFontSize}; line-height: 1.55; color: #2C2822;">
                ${page.paragraphs.map(p => `<p style="margin-bottom: 8px;">${p}</p>`).join("")}
              </div>
            </div>

            <!-- Brand Footer -->
            <div style="font-family: var(--sans); font-size: 9px; letter-spacing: 1.5px; color: #7A6045; text-transform: uppercase;">
              SUATU SAAT
            </div>
          </div>

          <!-- CENTER GUTTER / SPINE CREASE -->
          <div style="width: 3px; background: linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1), rgba(0,0,0,0.4)); box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 5; flex-shrink: 0;"></div>

          <!-- RIGHT PAGE: Dedicated Unique Artwork + Quote Overlay -->
          <div class="spread-page-right" style="flex: 1; position: relative; overflow: hidden; background: #0F0E0C; box-shadow: inset 15px 0 25px -10px rgba(0,0,0,0.35); border-top-right-radius: 4px; border-bottom-right-radius: 4px;">
            <img src="${page.image}" alt="${page.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
            <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%);"></div>

            <!-- Bottom Quote Overlay -->
            <div style="position: absolute; bottom: 20px; left: 16px; right: 16px; z-index: 3;">
              <div style="font-family: var(--serif); font-size: 13px; font-style: italic; line-height: 1.45; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.95);">
                "${page.quote}"
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
}
