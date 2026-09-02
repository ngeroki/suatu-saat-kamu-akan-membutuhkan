/**
 * SUATU SAAT v2 — Screen 1: Cover / Hero (Matches Mockup Panel 1)
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

      <!-- Status Bar -->
      <div class="statusbar" style="position: absolute; top: 0; left: 0; right: 0; z-index: 4;">
        <span>9:41</span>
        <div class="icons">
          <svg width="16" height="11" viewBox="0 0 16 11"><path d="M1 9L1 9C2 4 4 2 8 2C12 2 14 4 15 9" stroke="#EBE2D6" stroke-width="1.3" fill="none"/></svg>
          <svg width="15" height="11" viewBox="0 0 16 12"><rect x="0" y="8" width="3" height="4" fill="#EBE2D6"/><rect x="4.5" y="5" width="3" height="7" fill="#EBE2D6"/><rect x="9" y="2" width="3" height="10" fill="#EBE2D6"/><rect x="13.5" y="0" width="3" height="12" fill="#EBE2D6" opacity="0.4"/></svg>
          <svg width="22" height="11" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#EBE2D6" fill="none"/><rect x="2" y="2" width="15" height="8" rx="1" fill="#EBE2D6"/><rect x="21.5" y="4" width="1.5" height="4" fill="#EBE2D6"/></svg>
        </div>
      </div>

      <!-- Top Header -->
      <div class="ph-header" style="position: absolute; top: 38px; left: 0; right: 0; z-index: 4;">
        <span class="brand">SUATU SAAT</span>
        <div class="icon-btn" id="cover-menu-btn"><span></span><span></span><span></span></div>
      </div>

      <!-- Content at Bottom -->
      <div class="cover-content" style="position: relative; z-index: 3; padding: 0 26px 26px; display: flex; flex-direction: column;">
        <div class="book-float" style="align-self: center; width: 150px; height: 210px; margin-bottom: 20px; border-radius: 4px; overflow: hidden; box-shadow: 0 30px 50px -10px rgba(0,0,0,0.8); flex-shrink: 0;">
          <img src="assets/book_cover_3d.jpg" alt="SUATU SAAT Book Cover" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div class="eyebrow-label" style="margin-bottom: 8px;">DIGITAL FIELD GUIDE · 2026</div>

        <div style="font-family: var(--serif); font-weight: 500; font-size: 48px; line-height: 0.94; letter-spacing: 0.5px; margin-bottom: 14px; color: var(--bone);">
          SUATU<br>SAAT
        </div>

        <p style="font-size: 13.5px; line-height: 1.5; color: var(--bone-dim); max-width: 260px; margin-bottom: 12px; font-weight: 300; font-style: italic; font-family: var(--serif);">
          Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri.
        </p>

        <div style="font-size: 10.5px; letter-spacing: 1px; color: var(--bone-faint); margin-bottom: 18px;">
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
