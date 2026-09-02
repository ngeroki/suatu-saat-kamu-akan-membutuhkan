/**
 * SUATU SAAT v2 — Screen 4: Authentic 3D Book Spread Reader (100% Mockup Aligned)
 */
import { BOOK_SPREAD_PAGES, SpreadPage, getSpreadPage } from "../../data/spread-pages";
import { TOTAL_PAGES } from "../../data/chapters";
import { navigate, Route } from "../../router";
import { playPaperRustle } from "../../lib/audio";
import { attachGestures, attachKeyboardNav } from "../../lib/gestures";

export class ReaderScreen {
  private el: HTMLElement;
  private currentSpreadIndex = 0; // index inside BOOK_SPREAD_PAGES
  private isImmersive = false;
  private isLargeText = false;

  private topBarEl!: HTMLElement;
  private bookSpreadEl!: HTMLElement;
  private navTrackEl!: HTMLElement;
  private dotEl!: HTMLElement;
  private prevBtn!: HTMLElement;
  private nextBtn!: HTMLElement;

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
      <div class="ph-header" style="padding: 16px 20px 8px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <div class="back-btn" id="reader-back-btn" style="cursor: pointer; font-family: var(--sans); font-size: 12.5px; color: rgba(235, 226, 214, 0.7); display: flex; align-items: center; gap: 6px; letter-spacing: 0.2px;">
          <span style="font-size: 15px;">←</span>
          <span>Kembali ke Bab</span>
        </div>
        <div id="reader-chap-badge" style="font-family: var(--sans); font-size: 13.5px; letter-spacing: 1.5px; color: #EDE4D8; font-weight: 500; text-transform: uppercase;">
          BAB 02
        </div>
        <div id="reader-page-counter" style="font-family: var(--sans); font-size: 13px; color: rgba(235, 226, 214, 0.7); letter-spacing: 0.5px;">
          07 / 15
        </div>
      </div>

      <!-- 2. The Core 3D Book Spread (Fills main screen) -->
      <div id="book-spread-container" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 4px 14px 10px; max-width: 480px; width: 100%; margin: 0 auto; position: relative;">
        <!-- Injected dynamically -->
      </div>

      <!-- 3. Bottom Controls Area -->
      <div style="max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 8px;">
        <!-- Nav Track (Left circle, line + dot, Right circle) -->
        <div class="nav-track-bar" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 4px 20px 8px;">
          <div class="nav-circle" id="nav-btn-prev" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(235, 226, 214, 0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #EDE4D8; font-size: 18px; background: rgba(18,18,16,0.3); transition: background 0.2s, border-color 0.2s;">
            ←
          </div>
          <div class="nav-track" style="flex: 1; height: 2px; background: rgba(235, 226, 214, 0.15); position: relative; border-radius: 1px;">
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

    // Attach Event Listeners
    this.el.querySelector("#reader-back-btn")?.addEventListener("click", () => navigate("bab"));
    this.el.querySelector("#tab-btn-toc")?.addEventListener("click", () => navigate("toc"));
    
    this.el.querySelector("#tab-btn-teks")?.addEventListener("click", () => {
      this.isLargeText = !this.isLargeText;
      this.renderCurrentPage();
    });

    this.el.querySelector("#tab-btn-layar")?.addEventListener("click", () => {
      this.isImmersive = !this.isImmersive;
      this.renderCurrentPage();
    });

    this.prevBtn.addEventListener("click", () => this.prevPage());
    this.nextBtn.addEventListener("click", () => this.nextPage());

    // Gestures & Keyboard navigation
    attachGestures(this.el, {
      onSwipeLeft: () => this.nextPage(),
      onSwipeRight: () => this.prevPage(),
    });

    attachKeyboardNav(
      () => this.prevPage(),
      () => this.nextPage()
    );
  }

  public show(route?: Route): void {
    this.el.classList.add("active");

    const requestedChap = route?.params.chap ?? 1;
    const requestedPageInChap = route?.params.page ?? 1;

    // Find closest spread index
    const matchIndex = BOOK_SPREAD_PAGES.findIndex(
      p => p.chapterId === requestedChap && p.pageInChap >= requestedPageInChap
    );

    this.currentSpreadIndex = matchIndex >= 0 ? matchIndex : 0;
    this.renderCurrentPage();
  }

  public hide(): void {
    this.el.classList.remove("active");
  }

  private nextPage(): void {
    if (this.currentSpreadIndex < BOOK_SPREAD_PAGES.length - 1) {
      this.currentSpreadIndex++;
      playPaperRustle();
      this.renderCurrentPage();
    }
  }

  private prevPage(): void {
    if (this.currentSpreadIndex > 0) {
      this.currentSpreadIndex--;
      playPaperRustle();
      this.renderCurrentPage();
    }
  }

  private renderCurrentPage(): void {
    const page = BOOK_SPREAD_PAGES[this.currentSpreadIndex];
    if (!page) return;

    // Update Top Chrome Header
    const chapBadge = this.el.querySelector("#reader-chap-badge");
    const pageCounter = this.el.querySelector("#reader-page-counter");
    if (chapBadge) chapBadge.textContent = page.chapterNum;
    if (pageCounter) {
      const pStr = page.pageInChap < 10 ? `0${page.pageInChap}` : `${page.pageInChap}`;
      const totStr = page.totalInChap < 10 ? `0${page.totalInChap}` : `${page.totalInChap}`;
      pageCounter.textContent = `${pStr} / ${totStr}`;
    }

    // Update Nav Track Slider
    const percent = ((this.currentSpreadIndex) / (BOOK_SPREAD_PAGES.length - 1)) * 100;
    this.dotEl.style.left = `${percent}%`;

    if (this.currentSpreadIndex <= 0) {
      this.prevBtn.style.opacity = "0.3";
      this.prevBtn.style.pointerEvents = "none";
    } else {
      this.prevBtn.style.opacity = "1";
      this.prevBtn.style.pointerEvents = "auto";
    }

    if (this.currentSpreadIndex >= BOOK_SPREAD_PAGES.length - 1) {
      this.nextBtn.style.opacity = "0.3";
      this.nextBtn.style.pointerEvents = "none";
    } else {
      this.nextBtn.style.opacity = "1";
      this.nextBtn.style.pointerEvents = "auto";
    }

    // Render Book Spread (or Immersive Mode)
    if (this.isImmersive) {
      // Full-bleed mode
      this.bookSpreadEl.innerHTML = `
        <div style="width: 100%; height: 100%; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          <img src="${page.image}" alt="${page.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(10,10,8,0.85) 100%);"></div>
          <div style="position: absolute; bottom: 24px; left: 24px; right: 24px;">
            <div style="font-family: var(--serif); font-size: 20px; color: #FFFFFF; font-style: italic; line-height: 1.4; text-shadow: 0 2px 8px rgba(0,0,0,0.8);">
              "${page.quote}"
            </div>
            <div style="font-family: var(--sans); font-size: 11px; letter-spacing: 1.5px; color: rgba(235, 226, 214, 0.7); text-transform: uppercase; margin-top: 10px;">
              ${page.chapterTitle} · HAL ${page.globalPage}
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
        <div class="physical-book-spread" style="display: flex; width: 100%; height: 100%; max-height: 520px; border-radius: 6px; overflow: hidden; box-shadow: 0 25px 60px -10px rgba(0,0,0,0.85), 0 10px 25px rgba(0,0,0,0.6); position: relative;">
          <!-- LEFT PAGE: Bone Paper Typography -->
          <div class="spread-page-left" style="flex: 1; background: #E2D9CC; color: #161513; padding: 24px 18px 18px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: inset -15px 0 25px -10px rgba(0,0,0,0.22); border-top-left-radius: 4px; border-bottom-left-radius: 4px;">
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

          <!-- RIGHT PAGE: Full-bleed Artwork + Quote Overlay -->
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
