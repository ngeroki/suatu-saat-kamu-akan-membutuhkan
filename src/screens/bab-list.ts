/**
 * SUATU SAAT v2 — Screen 2: Daftar Bab (Matches Mockup Panel 2)
 */
import { CHAPTERS } from "../data/chapters";
import { navigate } from "../router";

export class BabListScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-bab";

    const cardsHTML = CHAPTERS.map(ch => `
      <div class="bab-card" data-chap="${ch.id}">
        <div class="bab-card-bg" style="background-image: url('${ch.image}');"></div>
        <div class="bab-card-inner">
          <div class="bab-card-top">
            <div class="bab-num">${ch.num}</div>
            <div class="bab-title">${ch.title}</div>
          </div>
          <div class="bab-tags">· ${ch.tags.join(" · ")}</div>
          <div class="bab-arrow">→</div>
        </div>
      </div>
    `).join("");

    this.el.innerHTML = `
      <!-- Status Bar -->
      <div class="statusbar">
        <span>9:41</span>
        <div class="icons">
          <svg width="16" height="11" viewBox="0 0 16 11"><path d="M1 9L1 9C2 4 4 2 8 2C12 2 14 4 15 9" stroke="#EBE2D6" stroke-width="1.3" fill="none"/></svg>
          <svg width="22" height="11" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#EBE2D6" fill="none"/><rect x="2" y="2" width="15" height="8" rx="1" fill="#EBE2D6"/></svg>
        </div>
      </div>

      <!-- Top Header -->
      <div class="ph-header">
        <span class="brand" id="bab-brand-home" style="cursor: pointer;">SUATU SAAT</span>
        <div class="icon-btn" id="bab-menu-toc"><span></span><span></span><span></span></div>
      </div>

      <!-- Sub Header -->
      <div style="padding: 0 22px 14px; display: flex; justify-content: space-between; align-items: flex-end;">
        <span style="font-family: var(--sans); font-size: 12.5px; letter-spacing: 1.6px; color: var(--bone); font-weight: 500;">DAFTAR BAB</span>
        <span style="font-size: 9.5px; color: var(--bone-faint); text-align: right; line-height: 1.5; letter-spacing: 0.3px;">Berbeda perspektif,<br>satu kesadaran.</span>
      </div>

      <!-- Bab List Scrollable -->
      <div class="bab-list" style="flex: 1; overflow-y: auto; padding: 0 22px 8px; display: flex; flex-direction: column; gap: 10px;">
        ${cardsHTML}
      </div>

      <!-- Footer CTA -->
      <div style="padding: 14px 22px 22px;">
        <button class="btn-primary" id="btn-mulai-membaca">
          Mulai Membaca →
        </button>
      </div>
    `;

    container.appendChild(this.el);

    // Event Listeners
    this.el.querySelector("#bab-brand-home")?.addEventListener("click", () => navigate("cover"));
    this.el.querySelector("#bab-menu-toc")?.addEventListener("click", () => navigate("toc"));
    this.el.querySelector("#btn-mulai-membaca")?.addEventListener("click", () => navigate("read", { chap: 1, page: 1 }));

    this.el.querySelectorAll(".bab-card").forEach(card => {
      card.addEventListener("click", () => {
        const chapId = parseInt(card.getAttribute("data-chap") || "1", 10);
        navigate("read", { chap: chapId, page: 1 });
      });
    });
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
