/**
 * SUATU SAAT v2 — Screen 1: Cover / Hero (Fullscreen WebApp)
 */
import { navigate } from "../router";

export class CoverScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen active";
    this.el.id = "screen-cover";
    this.el.style.justifyContent = "flex-end";

    this.el.innerHTML = `
      <!-- Full-bleed Background Image with Gradient Overlay -->
      <div class="full-bleed-bg gradient-overlay-bottom" style="background-image: url('assets/hero_bg.jpg'); position: absolute; inset: 0; z-index: 0;"></div>

      <!-- Top Header -->
      <div class="ph-header" style="position: absolute; top: 12px; left: 0; right: 0; z-index: 4;">
        <span class="brand">SUATU SAAT</span>
        <div class="icon-btn" id="cover-menu-btn"><span></span><span></span><span></span></div>
      </div>

      <!-- Content at Bottom -->
      <div class="cover-content" style="position: relative; z-index: 3; padding: 0 24px 36px; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 540px; margin: 0 auto; width: 100%;">
        <div class="book-float" style="width: 165px; height: 230px; margin-bottom: 24px; border-radius: 6px; overflow: hidden; box-shadow: 0 30px 60px -10px rgba(0,0,0,0.85); flex-shrink: 0;">
          <img src="assets/book_cover_3d.jpg" alt="SUATU SAAT Book Cover" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div class="eyebrow-label" style="margin-bottom: 8px;">DIGITAL FIELD GUIDE · 2026</div>

        <div style="font-family: var(--serif); font-weight: 500; font-size: 52px; line-height: 0.94; letter-spacing: 0.5px; margin-bottom: 14px; color: var(--bone);">
          SUATU SAAT
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: var(--bone-dim); max-width: 320px; margin-bottom: 12px; font-weight: 300; font-style: italic; font-family: var(--serif);">
          Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri.
        </p>

        <div style="font-size: 11px; letter-spacing: 1.5px; color: var(--bone-faint); margin-bottom: 22px;">
          5 BAB · 74 HALAMAN · NUSANTARA
        </div>

        <button class="btn-primary" id="btn-buka-buku">
          Buka Buku →
        </button>

        <div class="link-under" id="link-daftar-isi">
          Lihat Daftar Isi ⌄
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
