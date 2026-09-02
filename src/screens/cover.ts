/**
 * SUATU SAAT v2 — Screen 1: Cover / Hero (100% Mockup Aligned with User Artwork)
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
      <div class="full-bleed-bg" style="background-image: url('assets/hero_bg.jpg'); position: absolute; inset: 0; z-index: 0; background-position: center center; background-size: cover;"></div>
      <!-- Subtle top & bottom readability gradients -->
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.05) 35%, rgba(10,10,10,0.1) 75%, rgba(10,10,10,0.85) 100%); z-index: 1;"></div>

      <!-- Top Header Navigation -->
      <div class="ph-header" style="position: relative; z-index: 4; padding: 22px 24px 0; max-width: 480px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <span class="brand" style="font-family: var(--serif); font-size: 15px; letter-spacing: 2px; color: #EDE4D8; font-weight: 500;">SUATU SAAT</span>
        <div class="icon-btn" id="cover-menu-btn" style="width: 22px; height: 15px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;">
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
        </div>
      </div>

      <!-- Top-Left Editorial Typography Block -->
      <div style="position: relative; z-index: 3; padding: 22px 26px 0; max-width: 480px; width: 100%; margin: 0 auto; text-align: left; display: flex; flex-direction: column; align-items: flex-start;">
        <div style="font-family: var(--sans); font-size: 10.5px; letter-spacing: 2.2px; color: rgba(235,226,214,0.6); text-transform: uppercase; margin-bottom: 14px; font-weight: 500;">
          DIGITAL FIELD GUIDE · 2026
        </div>

        <div style="font-family: var(--serif); font-weight: 400; font-size: 46px; line-height: 0.94; letter-spacing: 0.5px; margin-bottom: 16px; color: #F5EFEB; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
          SUATU<br>SAAT
        </div>

        <div style="font-family: var(--serif); font-size: 15.5px; line-height: 1.42; color: rgba(235,226,214,0.85); max-width: 240px; margin-bottom: 16px; font-weight: 400; text-shadow: 0 1px 6px rgba(0,0,0,0.6);">
          Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri.
        </div>

        <div style="font-family: var(--sans); font-size: 10px; letter-spacing: 1.6px; color: rgba(235,226,214,0.5); line-height: 1.6; text-transform: uppercase;">
          5 BAB · 74 HALAMAN<br>NUSANTARA
        </div>
      </div>

      <!-- Middle Spacer: Showcases the 3D Book on the Mountain Rocks -->
      <div style="flex: 1; min-height: 120px;"></div>

      <!-- Bottom Action Area -->
      <div style="position: relative; z-index: 3; padding: 0 24px 28px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
        <button id="btn-buka-buku" style="background: #CDB397; color: #1C1916; border: none; padding: 16px 20px; border-radius: 12px; font-family: var(--sans); font-size: 14.5px; font-weight: 600; letter-spacing: 0.2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: transform 0.2s ease, background 0.2s ease;">
          Buka Buku →
        </button>

        <div id="link-daftar-isi" style="text-align: center; font-family: var(--sans); font-size: 12px; color: rgba(235,226,214,0.7); margin-top: 14px; cursor: pointer; letter-spacing: 0.3px; display: flex; align-items: center; gap: 4px;">
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
