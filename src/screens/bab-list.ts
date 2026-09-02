/**
 * SUATU SAAT v2 — Screen 2: Daftar Bab (Fullscreen WebApp)
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
      <!-- Top Header -->
      <div class="ph-header">
        <span class="brand" id="bab-brand-home" style="cursor: pointer;">SUATU SAAT</span>
        <div class="icon-btn" id="bab-menu-toc"><span></span><span></span><span></span></div>
      </div>

      <!-- Sub Header -->
      <div style="max-width: 700px; width: 100%; margin: 0 auto; padding: 0 24px 16px; display: flex; justify-content: space-between; align-items: flex-end;">
        <span style="font-family: var(--sans); font-size: 13px; letter-spacing: 1.8px; color: var(--bone); font-weight: 500;">DAFTAR BAB</span>
        <span style="font-size: 10px; color: var(--bone-faint); text-align: right; line-height: 1.5; letter-spacing: 0.3px;">Berbeda perspektif,<br>satu kesadaran.</span>
      </div>

      <!-- Bab List Scrollable -->
      <div class="bab-list" style="flex: 1; overflow-y: auto; padding: 0 24px 12px; display: flex; flex-direction: column; gap: 12px;">
        ${cardsHTML}
      </div>

      <!-- Footer CTA -->
      <div style="padding: 16px 24px 24px; max-width: 700px; width: 100%; margin: 0 auto;">
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
