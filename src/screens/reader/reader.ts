/**
 * SUATU SAAT v2 — Main Reader Shell Controller (Fullscreen WebApp)
 */
import { CHAPTERS, TOTAL_PAGES, getPageByGlobal } from "../../data/chapters";
import { navigate, Route } from "../../router";
import { NavTrack } from "../../components/nav-track";
import { TabBar } from "../../components/tab-bar";
import { FlipMode } from "./flip";
import { SpreadMode } from "./spread";
import { ImmersiveMode } from "./immersive";

export class ReaderScreen {
  private el: HTMLElement;
  private contentArea: HTMLElement;
  private chapBadgeEl: HTMLElement;
  private navTrack: NavTrack;
  private tabBar: TabBar;

  private currentChapId = 1;
  private currentPageInChap = 1;
  private currentGlobalPage = 1;
  private activeModeName: "flip" | "spread" | "immersive" = "flip";

  private flipMode: FlipMode | null = null;
  private spreadMode: SpreadMode | null = null;
  private immersiveMode: ImmersiveMode | null = null;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-reader";

    this.el.innerHTML = `
      <!-- Top Reader Chrome Header -->
      <div class="ph-header" style="padding: 12px 24px;">
        <div class="back-btn" id="reader-back-btn">← Kembali ke Bab</div>
        <div style="font-size: 12px; letter-spacing: 1.2px; color: var(--bone-dim); text-align: center;" id="reader-chap-badge">
          BAB 01 · 01 / 15
        </div>
        <div style="font-size: 18px; letter-spacing: 2px; color: var(--bone); cursor: pointer;" id="reader-menu-dots">···</div>
      </div>

      <!-- Main Reader Content Area -->
      <div class="reader-content-wrap" style="flex: 1; position: relative; overflow: hidden; display: flex; flex-direction: column;">
      </div>

      <!-- Bottom Chrome: NavTrack + TabBar -->
      <div class="reader-bottom-chrome" style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 8px; background: rgba(17,17,15,0.95); backdrop-filter: blur(10px); z-index: var(--z-chrome);">
        <div id="nav-track-mount"></div>
        <div id="tab-bar-mount"></div>
      </div>
    `;

    container.appendChild(this.el);

    this.contentArea = this.el.querySelector(".reader-content-wrap") as HTMLElement;
    this.chapBadgeEl = this.el.querySelector("#reader-chap-badge") as HTMLElement;

    // Mount NavTrack & TabBar
    const navMount = this.el.querySelector("#nav-track-mount") as HTMLElement;
    const tabMount = this.el.querySelector("#tab-bar-mount") as HTMLElement;

    this.navTrack = new NavTrack(navMount);
    this.tabBar = new TabBar(tabMount);

    // Event Listeners
    this.el.querySelector("#reader-back-btn")?.addEventListener("click", () => navigate("bab"));
    this.el.querySelector("#reader-menu-dots")?.addEventListener("click", () => {
      const nextMode = this.activeModeName === "flip" ? "spread" : "flip";
      this.switchMode(nextMode);
    });

    this.navTrack.onPrev(() => this.prevPage());
    this.navTrack.onNext(() => this.nextPage());

    this.tabBar.onTab((action) => {
      if (action === "toc") {
        navigate("toc");
      } else if (action === "teks") {
        const nextMode = this.activeModeName === "spread" ? "flip" : "spread";
        this.switchMode(nextMode);
      } else if (action === "layar") {
        const nextMode = this.activeModeName === "immersive" ? "flip" : "immersive";
        this.switchMode(nextMode);
      }
    });
  }

  public show(route?: Route): void {
    this.el.classList.add("active");

    const chapId = route?.params.chap ?? 1;
    const pageInChap = route?.params.page ?? 1;

    const chapData = CHAPTERS.find(c => c.id === chapId) || CHAPTERS[0];
    const globalPage = chapData.pageStart + Math.max(0, pageInChap - 1);

    this.currentChapId = chapData.id;
    this.currentPageInChap = pageInChap;
    this.currentGlobalPage = globalPage;

    const requestedMode = (route?.name === "spread" || route?.name === "immersive") ? route.name : "flip";
    this.switchMode(requestedMode);
  }

  public hide(): void {
    this.el.classList.remove("active");
    this.destroyActiveMode();
  }

  private switchMode(modeName: "flip" | "spread" | "immersive"): void {
    this.destroyActiveMode();
    this.activeModeName = modeName;

    if (modeName === "flip") {
      this.flipMode = new FlipMode(this.contentArea);
      this.flipMode.mount(this.currentGlobalPage);
      this.flipMode.onPageChange((c, p, g) => this.onPageUpdated(c, p, g));
    } else if (modeName === "spread") {
      this.spreadMode = new SpreadMode(this.contentArea);
      this.spreadMode.render(this.currentGlobalPage);
    } else if (modeName === "immersive") {
      this.immersiveMode = new ImmersiveMode(this.contentArea);
      this.immersiveMode.render(this.currentGlobalPage);
    }

    this.updateChromeUI();
  }

  private destroyActiveMode(): void {
    this.flipMode?.destroy();
    this.spreadMode?.destroy();
    this.immersiveMode?.destroy();

    this.flipMode = null;
    this.spreadMode = null;
    this.immersiveMode = null;
  }

  private nextPage(): void {
    if (this.activeModeName === "flip" && this.flipMode) {
      this.flipMode.next();
    } else {
      if (this.currentGlobalPage < TOTAL_PAGES) {
        const nextGlobal = this.currentGlobalPage + 1;
        const data = getPageByGlobal(nextGlobal);
        if (data) {
          this.onPageUpdated(data.chapter.id, data.page.pageInChapter, nextGlobal);
          if (this.spreadMode) this.spreadMode.render(nextGlobal);
          if (this.immersiveMode) this.immersiveMode.render(nextGlobal);
        }
      }
    }
  }

  private prevPage(): void {
    if (this.activeModeName === "flip" && this.flipMode) {
      this.flipMode.prev();
    } else {
      if (this.currentGlobalPage > 1) {
        const prevGlobal = this.currentGlobalPage - 1;
        const data = getPageByGlobal(prevGlobal);
        if (data) {
          this.onPageUpdated(data.chapter.id, data.page.pageInChapter, prevGlobal);
          if (this.spreadMode) this.spreadMode.render(prevGlobal);
          if (this.immersiveMode) this.immersiveMode.render(prevGlobal);
        }
      }
    }
  }

  private onPageUpdated(chapId: number, pageInChap: number, globalPage: number): void {
    this.currentChapId = chapId;
    this.currentPageInChap = pageInChap;
    this.currentGlobalPage = globalPage;
    this.updateChromeUI();
  }

  private updateChromeUI(): void {
    const chapData = CHAPTERS.find(c => c.id === this.currentChapId) || CHAPTERS[0];
    const chapNumStr = chapData.num;
    const pageInChapStr = this.currentPageInChap < 10 ? `0${this.currentPageInChap}` : `${this.currentPageInChap}`;
    const pageCountStr = chapData.pageCount < 10 ? `0${chapData.pageCount}` : `${chapData.pageCount}`;

    this.chapBadgeEl.textContent = `BAB ${chapNumStr} · ${pageInChapStr} / ${pageCountStr}`;
    this.navTrack.update(this.currentGlobalPage, TOTAL_PAGES);
  }
}
