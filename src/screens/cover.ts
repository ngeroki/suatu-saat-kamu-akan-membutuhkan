/**
 * SUATU SAAT v2 — Screen 1: Cover / Hero (100% Mockup Aligned with User Artwork)
 */
import { PAGES } from "../data/book";
import { navigate } from "../router";

export class CoverScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen active";
    this.el.id = "screen-cover";
    this.el.style.justifyContent = "space-between";

    this.el.innerHTML = `
      <!-- Full-bleed Master Background Image -->
      <div class="full-bleed-bg" style="background-image: url('assets/hero_bg.jpg'); position: absolute; inset: 0; z-index: 0; background-position: center 36%; background-size: cover;"></div>
      <!-- Subtle top & bottom readability gradients -->
      <div class="cover-gradient-overlay" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.12) 24%, rgba(10,10,10,0) 45%, rgba(10,10,10,0.2) 70%, rgba(10,10,10,0.92) 100%); z-index: 1; pointer-events: none;"></div>

      <!-- Centered Editorial Typography Block (Navbar removed) -->
      <div class="cover-header-block" style="position: relative; z-index: 3; padding: clamp(24px, 6vh, 48px) 20px 0; max-width: 480px; width: 100%; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center;">
        <div style="font-family: var(--sans); font-size: clamp(9px, 2.4vw, 10.5px); letter-spacing: clamp(2px, 0.8vw, 3px); color: rgba(235,226,214,0.75); text-transform: uppercase; margin-bottom: 8px; font-weight: 600; text-shadow: 0 2px 8px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9);">
          Yogyakarta · 2026
        </div>

        <div style="font-family: var(--display); font-weight: 500; font-size: clamp(26px, 6.5vw, 36px); line-height: 1.05; letter-spacing: 4px; margin-bottom: 8px; color: #F7F2EC; text-shadow: 0 3px 18px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95); text-transform: uppercase;">
          SUATU SAAT
        </div>

        <div style="width: 32px; height: 1px; background: rgba(205,179,151,0.5); margin-bottom: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.8);"></div>

        <div style="font-family: var(--serif); font-style: italic; font-size: clamp(12px, 3.2vw, 14px); line-height: 1.4; color: rgba(235,226,214,0.9); max-width: 270px; margin-bottom: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95);">
          “Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri.”
        </div>

        <div style="font-family: var(--sans); font-size: clamp(8.5px, 2.2vw, 9.5px); letter-spacing: clamp(1.5px, 0.5vw, 2px); color: rgba(235,226,214,0.65); text-transform: uppercase; text-shadow: 0 2px 8px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9);">
          5 BAB · 74 HALAMAN · NUSANTARA
        </div>
      </div>

      <!-- Middle Spacer: Showcases the 3D Book on the Mountain Rocks -->
      <div class="cover-middle-spacer" style="flex: 1; min-height: 20px;"></div>

      <!-- Bottom Action Area -->
      <div class="cover-action-area" style="position: relative; z-index: 3; padding: 0 20px clamp(16px, 4vh, 28px); max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
        <button id="btn-buka-buku" style="background: #CDB397; color: #1C1916; border: none; padding: clamp(12px, 2.5vh, 16px) 20px; border-radius: 10px; font-family: var(--sans); font-size: clamp(13px, 3.5vw, 14.5px); font-weight: 600; letter-spacing: 0.2px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: transform 0.2s ease, background 0.2s ease;">
          Buka Buku
        </button>

        <div id="link-daftar-isi" role="button" tabindex="0" aria-label="Lihat Daftar Isi" style="text-align: center; font-family: var(--sans); font-size: clamp(11.5px, 3.2vw, 12.5px); color: rgba(235,226,214,0.85); margin-top: clamp(8px, 1.8vh, 12px); cursor: pointer; letter-spacing: 0.3px; display: inline-flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 16px; transition: color 0.2s ease, transform 0.2s ease; text-shadow: 0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95);">
          <span>Lihat Daftar Isi</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8; transition: transform 0.2s ease;">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    `;

    container.appendChild(this.el);

    // Initial button state
    this.updateResumeButton();

    // Event Listeners
    this.el.querySelector("#btn-buka-buku")?.addEventListener("click", () => {
      try {
        const lastPage = localStorage.getItem("suatu_saat_last_page");
        if (lastPage !== null) {
          const idx = parseInt(lastPage, 10);
          if (!isNaN(idx) && idx >= 0 && idx < PAGES.length) {
            const targetPage = PAGES[idx];
            if (targetPage) {
              navigate("read", {
                chapter: String(targetPage.chapter_id),
                page: String(targetPage.page_in_chap),
                chap: targetPage.chapter_id,
              });
              return;
            }
          }
        }
      } catch (_) {}

      navigate("prolog");
    });

    this.el.querySelector("#link-daftar-isi")?.addEventListener("click", () => {
      navigate("toc");
    });
  }

  private updateResumeButton(): void {
    const btn = this.el.querySelector("#btn-buka-buku") as HTMLElement | null;
    if (!btn) return;

    try {
      const lastPage = localStorage.getItem("suatu_saat_last_page");
      if (lastPage !== null) {
        const idx = parseInt(lastPage, 10);
        if (!isNaN(idx) && idx >= 0 && idx < PAGES.length) {
          btn.textContent = `Lanjutkan Membaca (Hal ${idx + 1})`;
          return;
        }
      }
    } catch (_) {}

    btn.textContent = "Buka Buku";
  }

  public show(): void {
    this.el.classList.add("active");
    this.updateResumeButton();
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
