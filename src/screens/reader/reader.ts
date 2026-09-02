/**
 * SUATU SAAT v2 — Screen 4: 100% Mockup Aligned Physical Book Spread Reader
 * Backed by 389 Unabridged Manuscript Pages
 */
import { PAGES, Page, CHAPTERS } from "../../data/book";
import { navigate, Route } from "../../router";
import { playPaperRustle } from "../../lib/audio";
import { attachGestures, attachKeyboardNav } from "../../lib/gestures";

function formatMarkdownToHTML(md: string): string {
  const blocks = md.split(/\n\n+/);
  return blocks.map(b => {
    const trimmed = b.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("### ")) {
      return `<h3 style="font-family: var(--serif); font-size: 15px; font-weight: 500; color: #161513; margin: 8px 0 4px; line-height: 1.2;">${trimmed.replace(/^###\s+/, "")}</h3>`;
    }
    if (trimmed.startsWith("## ")) {
      return `<h2 style="font-family: var(--serif); font-size: 16.5px; font-weight: 500; color: #161513; margin: 10px 0 6px; line-height: 1.2;">${trimmed.replace(/^##\s+/, "")}</h2>`;
    }
    if (trimmed.startsWith("# ")) {
      return `<h1 style="font-family: var(--serif); font-size: 18px; font-weight: 500; color: #161513; margin: 12px 0 6px; line-height: 1.2;">${trimmed.replace(/^#\s+/, "")}</h1>`;
    }
    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s*/gm, "").replace(/[\*\_]/g, "");
      return `<blockquote style="border-left: 2px solid #7A6045; padding-left: 8px; margin: 6px 0; font-family: var(--serif); font-style: italic; font-size: 12px; color: #4A3E30; line-height: 1.4;">${quoteText}</blockquote>`;
    }
    if (trimmed.startsWith("---")) {
      return `<hr style="border: none; border-top: 1px solid rgba(122,96,69,0.2); margin: 8px 0;">`;
    }
    const formatted = trimmed
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return `<p style="margin-bottom: 6px; font-family: var(--serif); font-size: 12.5px; line-height: 1.45; color: #2C2822;">${formatted}</p>`;
  }).join("");
}

export class ReaderScreen {
  private el: HTMLElement;
  private currentGlobalIndex = 0; // 0..388
  private isImmersive = false;
  private isLargeText = false;
  private isFlipping = false;

  private topBarEl!: HTMLElement;
  private bookSpreadEl!: HTMLElement;
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
          01 / 41
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

    const trackBar = this.el.querySelector("#nav-track-bar") as HTMLElement;
    trackBar?.addEventListener("click", (e: MouseEvent) => {
      const rect = trackBar.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const curPage = PAGES[this.currentGlobalIndex];
      const chapPages = PAGES.filter(p => p.chapter_id === curPage.chapter_id);
      const targetInChap = Math.round(clickRatio * (chapPages.length - 1));
      const targetGlobal = chapPages[targetInChap].page_number - 1;
      if (targetGlobal !== this.currentGlobalIndex) {
        if (targetGlobal > this.currentGlobalIndex) {
          this.flipNextWithCurl(targetGlobal);
        } else {
          this.flipPrevWithCurl(targetGlobal);
        }
      }
    });

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

    const matchIndex = PAGES.findIndex(
      p => p.chapter_id === requestedChap && p.page_in_chap === requestedPageInChap
    );

    this.currentGlobalIndex = matchIndex >= 0 ? matchIndex : 0;
    this.renderCurrentSpread();
  }

  public hide(): void {
    this.el.classList.remove("active");
  }

  private flipNextWithCurl(targetIndex?: number): void {
    if (this.isFlipping) return;
    const nextIdx = targetIndex !== undefined ? targetIndex : this.currentGlobalIndex + 1;
    if (nextIdx >= PAGES.length) return;

    this.isFlipping = true;
    playPaperRustle();

    const book = this.bookSpreadEl.querySelector(".physical-book-spread") as HTMLElement;
    if (!book) {
      this.currentGlobalIndex = nextIdx;
      this.renderCurrentSpread();
      this.isFlipping = false;
      return;
    }

    const curPage = PAGES[this.currentGlobalIndex];
    const nextPage = PAGES[nextIdx];

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
      <img src="${curPage.image_path}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);"></div>
      <div style="position: absolute; bottom: 20px; left: 16px; right: 16px;">
        <div style="font-family: var(--serif); font-size: 13px; font-style: italic; line-height: 1.45; color: #FFFFFF;">
          "${curPage.subchapter_name}"
        </div>
      </div>
    `;

    const backFace = document.createElement("div");
    backFace.style.cssText = `
      position: absolute; inset: 0;
      backface-visibility: hidden;
      transform: rotateY(180deg);
      background: #E2D9CC;
      box-shadow: inset -15px 0 25px -10px rgba(0,0,0,0.3);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      display: flex; align-items: center; justify-content: center;
    `;
    backFace.innerHTML = `
      <div style="opacity: 0.15; font-family: var(--serif); font-size: 26px; letter-spacing: 2px; color: #141310;">
        SUATU SAAT
      </div>
    `;

    flipSheet.appendChild(frontFace);
    flipSheet.appendChild(backFace);
    book.appendChild(flipSheet);

    const rightPageEl = book.querySelector(".spread-page-right") as HTMLElement;
    if (rightPageEl) {
      rightPageEl.innerHTML = `
        <img src="${nextPage.image_path}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);"></div>
        <div style="position: absolute; bottom: 20px; left: 16px; right: 16px; z-index: 3;">
          <div style="font-family: var(--serif); font-size: 13px; font-style: italic; line-height: 1.45; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.95);">
            "${nextPage.subchapter_name}"
          </div>
        </div>
      `;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flipSheet.style.transform = "rotateY(-180deg)";
      });
    });

    setTimeout(() => {
      flipSheet.remove();
      this.currentGlobalIndex = nextIdx;
      this.renderCurrentSpread();
      this.isFlipping = false;
    }, 530);
  }

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

    const prevPage = PAGES[prevIdx];

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
    const curPage = PAGES[this.currentGlobalIndex];
    const pCurStr = curPage.page_in_chap < 10 ? `0${curPage.page_in_chap}` : `${curPage.page_in_chap}`;
    frontFace.innerHTML = `
      <div>
        <div style="font-family: var(--serif); font-size: 32px; font-weight: 400; color: #161513; margin-bottom: 10px; line-height: 1;">${pCurStr}</div>
        <div style="font-family: var(--serif); font-size: 15px; font-weight: 500; line-height: 1.25; color: #161513; margin-bottom: 12px;">${curPage.subchapter_name}</div>
      </div>
      <div style="font-family: var(--sans); font-size: 9px; letter-spacing: 1.5px; color: #7A6045;">SUATU SAAT</div>
    `;

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
      <img src="${prevPage.image_path}" style="width: 100%; height: 100%; object-fit: cover;">
    `;

    flipSheet.appendChild(frontFace);
    flipSheet.appendChild(backFace);
    book.appendChild(flipSheet);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flipSheet.style.transform = "rotateY(180deg)";
      });
    });

    setTimeout(() => {
      flipSheet.remove();
      this.currentGlobalIndex = prevIdx;
      this.renderCurrentSpread();
      this.isFlipping = false;
    }, 530);
  }

  private renderCurrentSpread(): void {
    const page = PAGES[this.currentGlobalIndex];
    if (!page) return;

    this.chapBadgeEl.textContent = page.chapter_code;
    const pStr = page.page_in_chap < 10 ? `0${page.page_in_chap}` : `${page.page_in_chap}`;
    const totStr = page.total_in_chap < 10 ? `0${page.total_in_chap}` : `${page.total_in_chap}`;
    this.pageCounterEl.textContent = `${pStr} / ${totStr}`;

    const chapPages = PAGES.filter(p => p.chapter_id === page.chapter_id);
    const chapIndex = chapPages.findIndex(p => p.page_number === page.page_number);
    const percent = ((chapIndex) / Math.max(1, chapPages.length - 1)) * 100;
    this.dotEl.style.left = `${percent}%`;

    if (this.currentGlobalIndex <= 0) {
      this.prevBtn.style.opacity = "0.3";
      this.prevBtn.style.pointerEvents = "none";
    } else {
      this.prevBtn.style.opacity = "1";
      this.prevBtn.style.pointerEvents = "auto";
    }

    if (this.currentGlobalIndex >= PAGES.length - 1) {
      this.nextBtn.style.opacity = "0.3";
      this.nextBtn.style.pointerEvents = "none";
    } else {
      this.nextBtn.style.opacity = "1";
      this.nextBtn.style.pointerEvents = "auto";
    }

    if (this.isImmersive) {
      this.bookSpreadEl.innerHTML = `
        <div style="width: 100%; height: 100%; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          <img src="${page.image_path}" alt="${page.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(10,10,8,0.9) 100%);"></div>
          <div style="position: absolute; bottom: 24px; left: 24px; right: 24px;">
            <div style="font-family: var(--sans); font-size: 10px; letter-spacing: 2px; color: #C5A059; text-transform: uppercase; margin-bottom: 6px;">
              ${page.badge}
            </div>
            <div style="font-family: var(--serif); font-size: 20px; color: #FFFFFF; font-style: italic; line-height: 1.35; text-shadow: 0 2px 8px rgba(0,0,0,0.8);">
              "${page.title}"
            </div>
            ${page.subtitle ? `
              <div style="font-family: var(--serif); font-size: 13px; color: rgba(235, 226, 214, 0.85); font-style: italic; margin-top: 4px; line-height: 1.35;">
                ${page.subtitle}
              </div>
            ` : ''}
            <div style="font-family: var(--sans); font-size: 10.5px; letter-spacing: 1.5px; color: rgba(235, 226, 214, 0.65); text-transform: uppercase; margin-top: 10px;">
              ${page.chapter_name} · HAL ${pStr} / ${totStr} (TOTAL: ${page.page_number} / ${PAGES.length})
            </div>
          </div>
        </div>
      `;
    } else {
      const pSize = this.isLargeText ? '13px' : '11.5px';
      const parasHTML = page.paragraphs.map((p, pIdx) => {
        const isQuote = p.startsWith('"') || p.startsWith('“');
        if (isQuote) {
          return `<blockquote style="border-left: 2px solid #8F7645; padding-left: 8px; margin: 6px 0; font-family: var(--serif); font-style: italic; font-size: ${pSize}; color: #3E352B; line-height: 1.45;">${p}</blockquote>`;
        }
        if (pIdx === 0 && p.length > 20 && !isQuote) {
          const firstLetter = p.charAt(0);
          const rest = p.slice(1);
          return `<p style="margin-bottom: 6px; font-family: var(--serif); font-size: ${pSize}; line-height: 1.45; color: #2C2822; text-align: justify;"><span style="float: left; font-size: 26px; line-height: 0.85; font-weight: 600; color: #7A6045; margin-right: 4px; padding-top: 2px;">${firstLetter}</span>${rest}</p>`;
        }
        return `<p style="margin-bottom: 6px; font-family: var(--serif); font-size: ${pSize}; line-height: 1.45; color: #2C2822; text-align: justify;">${p}</p>`;
      }).join("");

      const takeawayHTML = page.keyTakeaway ? `
        <div style="background: rgba(197, 160, 89, 0.12); border-left: 2px solid #8F7645; border-radius: 3px; padding: 6px 8px; margin-top: 8px; flex-shrink: 0;">
          <div style="font-family: var(--sans); font-size: 8px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #7A6045; margin-bottom: 2px;">Intisari Kesadaran</div>
          <div style="font-family: var(--serif); font-size: ${this.isLargeText ? '11.5px' : '10.5px'}; font-style: italic; color: #3A3228; line-height: 1.35;">"${page.keyTakeaway}"</div>
        </div>
      ` : "";

      this.bookSpreadEl.innerHTML = `
        <div class="physical-book-spread" style="display: flex; width: 100%; height: 100%; max-height: 520px; border-radius: 6px; overflow: visible; box-shadow: -10px 25px 60px -10px rgba(0,0,0,0.85), 10px 25px 60px -10px rgba(0,0,0,0.85); position: relative;">
          <!-- LEFT PAGE: Bone Paper Typography with Page Stack Edge -->
          <div class="spread-page-left" style="flex: 1; background: #E4DAD0; color: #161513; padding: 18px 16px 14px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: inset -18px 0 25px -10px rgba(0,0,0,0.25); border-left: 2px solid #C4B9A7; border-top-left-radius: 5px; border-bottom-left-radius: 5px; overflow: hidden;">
            <div style="flex: 1; overflow-y: auto; padding-right: 2px;" class="page-text-content">
              <!-- Top Header: Badge and Page Number -->
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; border-bottom: 1px solid rgba(122,96,69,0.18); padding-bottom: 4px;">
                <span style="font-family: var(--sans); font-size: 9px; font-weight: 600; letter-spacing: 1.5px; color: #7A6045; text-transform: uppercase;">
                  ${page.badge}
                </span>
                <span style="font-family: var(--serif); font-size: 22px; font-weight: 400; color: #161513; line-height: 1;">
                  ${pStr}
                </span>
              </div>

              <!-- Page Title -->
              <h2 style="font-family: var(--serif); font-size: ${this.isLargeText ? '16px' : '14.5px'}; font-weight: 600; color: #161513; line-height: 1.25; margin: 4px 0 2px 0;">
                ${page.title}
              </h2>

              <!-- Subtitle if exists -->
              ${page.subtitle ? `
                <div style="font-family: var(--serif); font-size: ${this.isLargeText ? '12px' : '11px'}; font-style: italic; color: #5C4B37; line-height: 1.35; margin-bottom: 6px;">
                  ${page.subtitle}
                </div>
              ` : ''}

              <!-- Narrative Body -->
              <div style="font-family: var(--serif); color: #2C2822; margin-top: 4px;">
                ${parasHTML}
              </div>

              <!-- Key Takeaway -->
              ${takeawayHTML}
            </div>

            <!-- Brand Footer -->
            <div style="font-family: var(--sans); font-size: 8.5px; letter-spacing: 1.5px; color: #7A6045; text-transform: uppercase; font-weight: 500; padding-top: 6px; border-top: 1px solid rgba(122,96,69,0.15); margin-top: 4px; flex-shrink: 0; display: flex; justify-content: space-between;">
              <span>SUATU SAAT</span>
              <span style="letter-spacing: 0.5px; opacity: 0.7;">HAL ${page.page_number} / ${PAGES.length}</span>
            </div>
          </div>

          <!-- CENTER GUTTER / SPINE CREASE -->
          <div style="width: 3px; background: linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1), rgba(0,0,0,0.4)); box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 5; flex-shrink: 0;"></div>

          <!-- RIGHT PAGE: Dedicated Unique Artwork + Context Overlay -->
          <div class="spread-page-right" style="flex: 1; position: relative; overflow: hidden; background: #0F0E0C; box-shadow: inset 18px 0 25px -10px rgba(0,0,0,0.38); border-top-right-radius: 5px; border-bottom-right-radius: 5px;">
            <img src="${page.image_path}" alt="${page.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
            <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 100%);"></div>

            <!-- Bottom Context Overlay -->
            <div style="position: absolute; bottom: 16px; left: 14px; right: 14px; z-index: 3;">
              <div style="font-family: var(--sans); font-size: 8.5px; letter-spacing: 1.5px; color: #CDB397; text-transform: uppercase; margin-bottom: 2px;">
                ${page.chapter_code} · HALAMAN ${pStr}
              </div>
              <div style="font-family: var(--serif); font-size: 12.5px; font-style: italic; line-height: 1.35; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.95);">
                "${page.title}"
              </div>
              ${page.imageCaption ? `
                <div style="font-family: var(--sans); font-size: 8.5px; color: rgba(235, 226, 214, 0.75); font-style: italic; margin-top: 3px; line-height: 1.3; text-shadow: 0 1px 4px rgba(0,0,0,0.9);">
                  ${page.imageCaption}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }
  }
}
