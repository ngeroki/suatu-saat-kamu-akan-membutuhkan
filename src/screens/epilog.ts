/**
 * SUATU SAAT v2 — Screen: Epilog (Catatan Penutup: Menjadi Manusia Normal)
 */
import { navigate } from "../router";
import { playPageTurn } from "../lib/audio";

export class EpilogScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen screen-epilog";
    this.el.id = "screen-epilog";

    this.render();
    container.appendChild(this.el);
  }

  private render(): void {
    this.el.innerHTML = `
      <div class="prolog-epilog-shell">
        <!-- Top Navigation Bar -->
        <header class="pe-header">
          <button class="pe-btn-menu" id="epilog-btn-menu" aria-label="Daftar Bab & Isi">
            <span style="font-size: 18px;">☰</span>
          </button>
          <div class="pe-brand" id="epilog-btn-home" role="button" tabindex="0" title="Kembali ke Beranda">SUATU SAAT</div>
          <span class="pe-badge">EPILOG</span>
        </header>

        <!-- Top Artwork Stage (45% Height) -->
        <div class="pe-artwork-box">
          <img class="pe-artwork-img" src="/assets/epilog_keluarga.jpg" alt="Keluarga di Senja" loading="eager">
          <div class="pe-artwork-mask"></div>

          <!-- Floating Navigation Chevrons -->
          <button class="pe-chevron pe-chevron-prev" id="epilog-btn-prev" aria-label="Kembali ke Bab 5">
            <span>‹</span>
          </button>
          <button class="pe-chevron pe-chevron-next" id="epilog-btn-next" aria-label="Selesai Membaca">
            <span>›</span>
          </button>
        </div>

        <!-- Bottom Editorial Content Box (55% Height) -->
        <div class="pe-content-box">
          <div>
            <div class="pe-title-tag">CATATAN PENUTUP</div>
            <h1 class="pe-title">Menjadi Manusia Normal</h1>

            <div class="pe-quote-card">
              <p class="pe-quote-text">“Kamu cuma perlu jadi manusia biasa yang hadir—yang beneran dengerin anaknya cerita, nemenin istrinya ngobrol. Itu aja sudah spiritualitas tertinggi.”</p>
              <span class="pe-quote-cite">— ALDI (@RAHWANACONSCIOUSNESSROOM)</span>
            </div>

            <p class="pe-body-p">
              <span class="pe-dropcap">P</span>uncak pencapaian spiritual bukanlah terbang atau membaca pikiran, melainkan kemampuan kembali menjadi manusia biasa yang hadir utuh bagi sesama. Bekerja jujur tanpa jargon rumit, menolong dengan empati tanpa menghakimi, dan menyadari bahwa semua sains tubuh tak berarti jika kita gagal hadir untuk keluarga.
            </p>
          </div>

          <div class="pe-footer-row">
            <span class="pe-footer-brand">SUATU SAAT · NUSANTARA</span>
            <button class="pe-btn-cta" id="epilog-btn-cta">
              Selesai Membaca ✦
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind DOM Events
    this.el.querySelector("#epilog-btn-menu")?.addEventListener("click", () => navigate("bab"));
    this.el.querySelector("#epilog-btn-home")?.addEventListener("click", () => navigate("cover"));

    this.el.querySelector("#epilog-btn-prev")?.addEventListener("click", () => {
      playPageTurn();
      navigate("read", { chap: 5, page: 15 });
    });

    const finish = () => {
      playPageTurn();
      navigate("cover");
    };

    this.el.querySelector("#epilog-btn-next")?.addEventListener("click", finish);
    this.el.querySelector("#epilog-btn-cta")?.addEventListener("click", finish);
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
