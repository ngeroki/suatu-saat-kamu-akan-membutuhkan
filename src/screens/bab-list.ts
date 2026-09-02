/**
 * SUATU SAAT v2 — Screen 2: Daftar Bab (100% Mockup Aligned)
 */
import { navigate } from "../router";

const BAB_CARDS_DATA = [
  {
    id: 1,
    num: "01",
    title: "Anatomi Tubuh Energi\n& Memori Karma",
    tags: ["Medan Torus", "Memori Karma", "Cairan CSF"],
    image: "assets/bab_01_torus.jpg",
  },
  {
    id: 2,
    num: "02",
    title: "Meretas Pikiran\nBawah Sadar\n& Reprogramming Nasib",
    tags: ["Zona Theta", "Critical Faculty", "Jeda 3 Detik"],
    image: "assets/bab_02_theta.jpg",
  },
  {
    id: 3,
    num: "03",
    title: "Sistem Hormon,\nBiohacking Leluhur",
    tags: ["Dopamin", "Ritme Sirkadian", "Puasa Weton"],
    image: "assets/bab_03_biohack.jpg",
  },
  {
    id: 4,
    num: "04",
    title: "Fisika Kuantum,\nRelativitas &\nKeterhubungan",
    tags: ["Keterhubungan", "Relativitas", "Titik Nol"],
    image: "assets/bab_04_kuantum.jpg",
  },
  {
    id: 5,
    num: "05",
    title: "Menjadi Manusia\nNormal & Seni\nBerserah",
    tags: ["Anti Spiritual Bypass", "Dunia Fisik", "Titik Nol"],
    image: "assets/bab_05_berserah.jpg",
  },
];

export class BabListScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-bab";
    this.el.style.background = "#0A0A08";

    const cardsHTML = BAB_CARDS_DATA.map(ch => {
      const bulletsHTML = ch.tags.map(tag => `<div style="margin-bottom: 2px;">• ${tag}</div>`).join("");
      return `
        <div class="bab-card-exact" data-chap="${ch.id}" style="position: relative; height: 168px; border-radius: 14px; overflow: hidden; cursor: pointer; background: #121210; border: 1px solid rgba(235, 226, 214, 0.1); display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s ease, border-color 0.2s ease; flex-shrink: 0;">
          <!-- Left Text Content -->
          <div style="position: relative; z-index: 2; padding: 14px 18px; display: flex; flex-direction: column; justify-content: space-between; height: 100%; max-width: 65%;">
            <div>
              <div style="font-family: var(--serif); font-size: 24px; color: #EDE4D8; font-weight: 500; line-height: 1; margin-bottom: 4px;">
                ${ch.num}
              </div>
              <div style="font-family: var(--serif); font-size: 16.5px; line-height: 1.25; font-weight: 500; color: #EDE4D8; white-space: pre-line; margin-bottom: 8px;">
                ${ch.title}
              </div>
            </div>
            <div style="font-family: var(--sans); font-size: 10.5px; color: rgba(235, 226, 214, 0.65); line-height: 1.35; letter-spacing: 0.2px; padding-bottom: 2px;">
              ${bulletsHTML}
            </div>
          </div>

          <!-- Right Artwork Plate with Smooth Fade Mask -->
          <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 55%; z-index: 1; overflow: hidden;">
            <img src="${ch.image}" alt="${ch.num}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
            <div style="position: absolute; inset: 0; background: linear-gradient(to right, #121210 5%, rgba(18,18,16,0.7) 35%, rgba(18,18,16,0.15) 75%, transparent 100%);"></div>
          </div>

          <!-- Circle Arrow Indicator -->
          <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); z-index: 3; width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(235, 226, 214, 0.35); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #EDE4D8; background: rgba(18,18,16,0.4); backdrop-filter: blur(4px); transition: background 0.2s, border-color 0.2s;">
            →
          </div>
        </div>
      `;
    }).join("");

    this.el.innerHTML = `
      <!-- Top Header Navigation -->
      <div class="ph-header" style="padding: 20px 24px 14px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <span class="brand" id="bab-brand-home" style="cursor: pointer; font-family: var(--serif); font-size: 16px; letter-spacing: 2px; color: #EDE4D8; font-weight: 500;">SUATU SAAT</span>
        <div class="icon-btn" id="bab-menu-toc" style="width: 22px; height: 15px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;">
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
          <span style="display: block; height: 1.5px; background: #EDE4D8; width: 100%;"></span>
        </div>
      </div>

      <!-- Sub Header Row -->
      <div style="max-width: 480px; width: 100%; margin: 0 auto; padding: 0 24px 16px; display: flex; justify-content: space-between; align-items: flex-end;">
        <span style="font-family: var(--serif); font-size: 22px; letter-spacing: 1px; color: #EDE4D8; font-weight: 500;">DAFTAR BAB</span>
        <span style="font-family: var(--sans); font-size: 9px; color: rgba(235, 226, 214, 0.5); text-align: right; line-height: 1.5; letter-spacing: 1.5px; text-transform: uppercase;">
          BERBEDA PERSPEKTIF,<br>SATU KESADARAN.
        </span>
      </div>

      <!-- Bab List Scrollable -->
      <div class="bab-list-scroll" style="flex: 1; overflow-y: auto; padding: 0 20px 14px; max-width: 480px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 12px;">
        ${cardsHTML}
      </div>

      <!-- Bottom Sticky CTA -->
      <div style="padding: 12px 24px 24px; max-width: 480px; width: 100%; margin: 0 auto; background: linear-gradient(180deg, transparent 0%, #0A0A08 40%);">
        <button class="btn-primary" id="btn-mulai-membaca" style="background: #CDB397; color: #1C1916; border: none; padding: 16px 20px; border-radius: 12px; font-family: var(--sans); font-size: 14.5px; font-weight: 600; letter-spacing: 0.2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          Mulai Membaca →
        </button>
      </div>
    `;

    container.appendChild(this.el);

    // Event Listeners
    this.el.querySelector("#bab-brand-home")?.addEventListener("click", () => navigate("cover"));
    this.el.querySelector("#bab-menu-toc")?.addEventListener("click", () => navigate("toc"));
    this.el.querySelector("#btn-mulai-membaca")?.addEventListener("click", () => navigate("read", { chap: 1, page: 1 }));

    this.el.querySelectorAll(".bab-card-exact").forEach(card => {
      card.addEventListener("click", () => {
        const chapId = parseInt(card.getAttribute("data-chap") || "1", 10);
        navigate("read", { chap: chapId, page: 1 });
      });
      card.addEventListener("mouseenter", () => {
        (card as HTMLElement).style.borderColor = "rgba(235, 226, 214, 0.3)";
      });
      card.addEventListener("mouseleave", () => {
        (card as HTMLElement).style.borderColor = "rgba(235, 226, 214, 0.1)";
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
