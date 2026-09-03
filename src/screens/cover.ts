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

      <!-- Centered Editorial Typography Block (Navbar removed) -->
      <div style="position: relative; z-index: 3; padding: 50px 24px 0; max-width: 480px; width: 100%; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center;">
        <div style="font-family: var(--sans); font-size: 10.5px; letter-spacing: 3px; color: rgba(235,226,214,0.65); text-transform: uppercase; margin-bottom: 12px; font-weight: 500;">
          DIGITAL FIELD GUIDE · 2026
        </div>

        <div style="font-family: var(--display); font-weight: 500; font-size: 38px; line-height: 1.05; letter-spacing: 5px; margin-bottom: 12px; color: #F7F2EC; text-shadow: 0 3px 14px rgba(0,0,0,0.6); text-transform: uppercase;">
          SUATU SAAT
        </div>

        <div style="width: 32px; height: 1px; background: rgba(205,179,151,0.45); margin-bottom: 14px;"></div>

        <div style="font-family: var(--serif); font-style: italic; font-size: 14.5px; line-height: 1.48; color: rgba(235,226,214,0.85); max-width: 290px; margin-bottom: 14px; text-shadow: 0 2px 8px rgba(0,0,0,0.7);">
          “Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri.”
        </div>

        <div style="font-family: var(--sans); font-size: 9.5px; letter-spacing: 2px; color: rgba(235,226,214,0.5); text-transform: uppercase;">
          5 BAB · 74 HALAMAN · NUSANTARA
        </div>
      </div>

      <!-- Middle Spacer: Showcases the 3D Book on the Mountain Rocks -->
      <div style="flex: 1; min-height: 80px;"></div>

      <!-- Bottom Action Area -->
      <div style="position: relative; z-index: 3; padding: 0 24px 28px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
        <button id="btn-buka-buku" style="background: #CDB397; color: #1C1916; border: none; padding: 16px 20px; border-radius: 12px; font-family: var(--sans); font-size: 14.5px; font-weight: 600; letter-spacing: 0.2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: transform 0.2s ease, background 0.2s ease;">
          Buka Buku →
        </button>

        <div id="link-daftar-isi" style="text-align: center; font-family: var(--sans); font-size: 12.5px; color: rgba(235,226,214,0.75); margin-top: 14px; cursor: pointer; letter-spacing: 0.3px; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; transition: color 0.2s ease;">
          <span>Lihat Daftar Isi</span>
          <span style="font-size: 14px; line-height: 1; transition: transform 0.2s ease;">→</span>
        </div>
      </div>
    `;

    container.appendChild(this.el);

    // Event Listeners
    this.el.querySelector("#btn-buka-buku")?.addEventListener("click", () => {
      navigate("prolog");
    });

    this.el.querySelector("#link-daftar-isi")?.addEventListener("click", () => {
      navigate("toc");
    });
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
