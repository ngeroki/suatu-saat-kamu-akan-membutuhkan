/**
 * SUATU SAAT v2 — Screen: Prolog (Kata Pengantar: Obrolan di Pinggir Jalan)
 */
import { navigate } from "../router";
import { playPageTurn } from "../lib/audio";

export class PrologScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen screen-prolog";
    this.el.id = "screen-prolog";

    this.render();
    container.appendChild(this.el);
  }

  private render(): void {
    this.el.innerHTML = `
      <div class="prolog-epilog-shell">
        <!-- Top Navigation Bar -->
        <header class="pe-header">
          <button class="pe-btn-menu" id="prolog-btn-menu" aria-label="Daftar Bab & Isi">
            <span style="font-size: 18px;">☰</span>
          </button>
          <div class="pe-brand" id="prolog-btn-home" role="button" tabindex="0" title="Kembali ke Beranda">SUATU SAAT</div>
          <span class="pe-badge">PROLOG</span>
        </header>

        <!-- Top Artwork Stage (45% Height) -->
        <div class="pe-artwork-box">
          <img class="pe-artwork-img" src="/assets/prolog_warkop.jpg" alt="Warkop Malam" loading="eager">
          <div class="pe-artwork-mask"></div>

          <!-- Floating Navigation Chevrons -->
          <button class="pe-chevron pe-chevron-prev" id="prolog-btn-prev" aria-label="Ke Sampul">
            <span>‹</span>
          </button>
          <button class="pe-chevron pe-chevron-next" id="prolog-btn-next" aria-label="Mulai Bab 1">
            <span>›</span>
          </button>
        </div>

        <!-- Bottom Editorial Content Box (55% Height) -->
        <div class="pe-content-box">
          <div>
            <div class="pe-title-tag">KATA PENGANTAR</div>
            <h1 class="pe-title">Obrolan di Pinggir Jalan</h1>

            <div class="pe-quote-card">
              <p class="pe-quote-text">“Kita ngobrol ya, nggak usah serius-serius amat. Yang penting jujur. Nanti kalo udah waktunya butuh, bakal nyambung sendiri.”</p>
              <span class="pe-quote-cite">— ALDI (@RAHWANACONSCIOUSNESSROOM)</span>
            </div>

            <p class="pe-body-p">
              <span class="pe-dropcap">B</span>uku ini tidak lahir dari panggung seminar ber-AC, melainkan dari obrolan tak terencana di warung kopi pinggir jalan Yogya di bawah jembatan layang. Sains tubuh, hormon, dan fisika kuantum dibedah tanpa menggurui—seperti kawan lama yang menemukan rahasia hidup. Cukup buka pikiranmu sedikit; suatu saat kata-kata ini akan menemukan muaranya.
            </p>
          </div>

          <div class="pe-footer-row">
            <span class="pe-footer-brand">SUATU SAAT · NUSANTARA</span>
            <button class="pe-btn-cta" id="prolog-btn-cta">
              Mulai Bab 1 →
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind DOM Events
    this.el.querySelector("#prolog-btn-menu")?.addEventListener("click", () => navigate("bab"));
    this.el.querySelector("#prolog-btn-home")?.addEventListener("click", () => navigate("cover"));

    this.el.querySelector("#prolog-btn-prev")?.addEventListener("click", () => {
      playPageTurn();
      navigate("cover");
    });

    const goNext = () => {
      playPageTurn();
      navigate("read", { chap: 1, page: 1 });
    };

    this.el.querySelector("#prolog-btn-next")?.addEventListener("click", goNext);
    this.el.querySelector("#prolog-btn-cta")?.addEventListener("click", goNext);
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
