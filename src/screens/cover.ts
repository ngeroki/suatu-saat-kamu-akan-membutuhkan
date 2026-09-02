/**
 * SUATU SAAT v2 — Screen 1: Cover / Hero (100% Mockup Aligned)
 */
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
      <div class="full-bleed-bg" style="background-image: url('assets/hero_bg.jpg'); position: absolute; inset: 0; z-index: 0; background-position: center bottom; background-size: cover;"></div>
      <!-- Subtle top vignette gradient for text readability -->
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(14,14,14,0.65) 0%, rgba(14,14,14,0.15) 45%, rgba(14,14,14,0.4) 80%, rgba(14,14,14,0.92) 100%); z-index: 1;"></div>

      <!-- Top Header Navigation -->
      <div class="ph-header" style="position: relative; z-index: 4; padding: 22px 26px 0; max-width: 480px; width: 100%; margin: 0 auto;">
        <span class="brand" style="font-family: var(--serif); font-size: 15px; letter-spacing: 2px; color: #EDE4D8; font-weight: 500;">SUATU SAAT</span>
        <div class="icon-btn" id="cover-menu-btn" style="width: 22px; height: 15px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;">
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
        </div>
      </div>

      <!-- Top-Left Editorial Typography Block -->
      <div style="position: relative; z-index: 3; padding: 24px 26px 0; max-width: 480px; width: 100%; margin: 0 auto; text-align: left; display: flex; flex-direction: column; align-items: flex-start;">
        <div style="font-family: var(--sans); font-size: 10px; letter-spacing: 2.2px; color: rgba(235,226,214,0.55); text-transform: uppercase; margin-bottom: 16px; font-weight: 500;">
          DIGITAL FIELD GUIDE · 2026
        </div>

        <div style="font-family: var(--serif); font-weight: 400; font-size: 46px; line-height: 0.94; letter-spacing: 0.5px; margin-bottom: 16px; color: #F2ECE1;">
          SUATU<br>SAAT
        </div>

        <div style="font-family: var(--serif); font-size: 15px; line-height: 1.45; color: rgba(235,226,214,0.8); max-width: 240px; margin-bottom: 16px; font-weight: 400;">
          Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri.
        </div>

        <div style="font-family: var(--sans); font-size: 10px; letter-spacing: 1.5px; color: rgba(235,226,214,0.45); line-height: 1.6; text-transform: uppercase;">
          5 BAB · 74 HALAMAN<br>NUSANTARA
        </div>
      </div>

      <!-- Middle Spacer: Showcases the 3D Book on the Volcanic Rocks -->
      <div style="flex: 1; min-height: 140px;"></div>

      <!-- Bottom Action Area -->
      <div style="position: relative; z-index: 3; padding: 0 24px 30px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
        <button id="btn-buka-buku" style="background: #D1B498; color: #1E1B18; border: none; padding: 16px 20px; border-radius: 12px; font-family: var(--sans); font-size: 14.5px; font-weight: 600; letter-spacing: 0.2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.4); transition: transform 0.2s ease, background 0.2s ease;">
          Buka Buku →
        </button>

        <div id="link-daftar-isi" style="text-align: center; font-family: var(--sans); font-size: 12px; color: rgba(235,226,214,0.65); margin-top: 14px; cursor: pointer; letter-spacing: 0.3px; display: flex; align-items: center; gap: 4px;">
          <span>Lihat Daftar Isi</span>
          <span style="font-size: 13px;">⌄</span>
        </div>
      </div>
    `;

    container.appendChild(this.el);

    // Event Listeners
    this.el.querySelector("#btn-buka-buku")?.addEventListener("click", () => {
      navigate("read", { chap: 1, page: 1 });
    });

    this.el.querySelector("#link-daftar-isi")?.addEventListener("click", () => {
      navigate("toc");
    });

    this.el.querySelector("#cover-menu-btn")?.addEventListener("click", () => {
      navigate("bab");
    });
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
