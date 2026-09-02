/**
 * SUATU SAAT v2 — Flip Mode (StPageFlip 3D Engine)
 */
import { PageFlip } from "page-flip";
import { CHAPTERS, getAllPages } from "../../data/chapters";
import { playPaperRustle } from "../../lib/audio";
import { attachGestures, attachKeyboardNav } from "../../lib/gestures";

export class FlipMode {
  private container: HTMLElement;
  private flipBook: PageFlip | null = null;
  private onPageChangeCb?: (chapId: number, pageInChap: number, globalPage: number) => void;
  private detachGestures?: () => void;
  private detachKeys?: () => void;

  constructor(parent: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.position = "relative";
    parent.appendChild(this.container);
  }

  public mount(initialGlobalPage: number): void {
    this.container.innerHTML = `<div id="st-flip-book" style="width: 100%; height: 100%;"></div>`;
    const bookEl = this.container.querySelector("#st-flip-book") as HTMLElement;

    const allPages = getAllPages();
    const pagesHTML = allPages.map(({ chapter, page }) => `
      <div class="flip-page" style="background: #EBE2D6; color: #11110F; padding: 22px 18px; display: flex; flex-direction: column; height: 100%; box-shadow: inset 0 0 20px rgba(0,0,0,0.06);">
        <div style="font-family: var(--sans); font-size: 9.5px; letter-spacing: 1.5px; color: var(--earth); font-weight: 600; margin-bottom: 8px; text-transform: uppercase;">
          ${page.badge}
        </div>
        <div style="font-family: var(--serif); font-size: 18px; font-weight: 600; line-height: 1.18; margin-bottom: 8px; color: #11110F;">
          ${page.title}
        </div>
        ${page.subtitle ? `<div style="font-family: var(--serif); font-style: italic; font-size: 12px; color: var(--earth); margin-bottom: 12px;">${page.subtitle}</div>` : ''}
        
        <div style="flex: 1; overflow-y: auto; font-size: 10.5px; line-height: 1.65; color: #3a352c; font-family: var(--sans);">
          ${page.paragraphs.map(p => `<p style="margin-bottom: 8px;">${p}</p>`).join("")}
          ${page.quote ? `
            <blockquote style="font-style: italic; font-family: var(--serif); font-size: 12px; color: var(--earth); border-left: 2px solid var(--earth); padding-left: 10px; margin: 10px 0;">
              "${page.quote}"
              ${page.quoteAttrib ? `<br><span style="font-size: 10px; font-style: normal; color: var(--charcoal);">— ${page.quoteAttrib}</span>` : ''}
            </blockquote>
          ` : ''}
          ${page.keyTakeaway ? `
            <div style="margin-top: 10px; padding: 8px 10px; background: rgba(122, 96, 69, 0.08); border-left: 3px solid var(--earth); font-size: 9.5px; color: #4A3E31;">
              <strong>INTISARI PELAJARAN:</strong> ${page.keyTakeaway}
            </div>
          ` : ''}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 8.5px; letter-spacing: 1.5px; color: var(--earth); border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
          <span>SUATU SAAT</span>
          <span>HAL ${page.globalPage} / 74</span>
        </div>
      </div>
    `).join("");

    bookEl.innerHTML = pagesHTML;

    try {
      this.flipBook = new PageFlip(bookEl, {
        width: 330,
        height: 480,
        size: "stretch",
        minWidth: 280,
        maxWidth: 430,
        minHeight: 400,
        maxHeight: 700,
        showCover: false,
        usePortrait: true,
        drawShadow: true,
        maxShadowOpacity: 0.4,
        flippingTime: 550,
      });

      const elements = bookEl.querySelectorAll(".flip-page");
      if (elements.length > 0) {
        this.flipBook.loadFromHtml(elements as any);
      }

      // Jump to initial page
      const startIdx = Math.max(0, Math.min(allPages.length - 1, initialGlobalPage - 1));
      setTimeout(() => {
        try {
          this.flipBook?.flip(startIdx);
        } catch (e) {
          console.warn("Flip error:", e);
        }
      }, 100);

      this.flipBook.on("flip", (e: any) => {
        playPaperRustle();
        const currentIdx = typeof e.data === 'number' ? e.data : 0;
        const p = allPages[currentIdx];
        if (p) {
          this.onPageChangeCb?.(p.chapter.id, p.page.pageInChapter, p.page.globalPage);
        }
      });
    } catch (err) {
      console.warn("StPageFlip init fallback:", err);
    }

    // Attach gestures & keys
    this.detachGestures = attachGestures(this.container, {
      onSwipeLeft: () => this.flipBook?.flipNext(),
      onSwipeRight: () => this.flipBook?.flipPrev(),
    });

    this.detachKeys = attachKeyboardNav(
      () => this.flipBook?.flipPrev(),
      () => this.flipBook?.flipNext()
    );
  }

  public goTo(globalPage: number): void {
    if (this.flipBook) {
      this.flipBook.flip(globalPage - 1);
    }
  }

  public next(): void {
    this.flipBook?.flipNext();
  }

  public prev(): void {
    this.flipBook?.flipPrev();
  }

  public onPageChange(cb: (chapId: number, pageInChap: number, globalPage: number) => void): void {
    this.onPageChangeCb = cb;
  }

  public destroy(): void {
    this.detachGestures?.();
    this.detachKeys?.();
    this.container.innerHTML = "";
  }
}
