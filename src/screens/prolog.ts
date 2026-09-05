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
        </div>

        <!-- Floating Navigation Chevrons (Vertically Centered in Screen) -->
        <button class="pe-chevron pe-chevron-prev" id="prolog-btn-prev" aria-label="Ke Sampul">
          <span>‹</span>
        </button>
        <button class="pe-chevron pe-chevron-next" id="prolog-btn-next" aria-label="Mulai Bab 1">
          <span>›</span>
        </button>

        <!-- Bottom Editorial Content Box (55% Height) -->
        <div class="pe-content-box">
          <div class="pe-inner-content">
            <div class="pe-meta-header">
              <div class="pe-kicker">KATA PENGANTAR</div>
              <h1 class="pe-title">Obrolan di Pinggir Jalan</h1>
              <div class="pe-divider">✧</div>
            </div>

            <div class="pe-pullquote">
              <p class="pe-quote-text">“Kita ngobrol ya, nggak usah serius-serius amat. Yang penting jujur. Nanti juga kalo udah waktunya kamu butuh, semua yang kita obrolin ini bakal nyambung sendiri.”</p>
              <span class="pe-quote-cite">— Mas Aldi</span>
            </div>

            <p class="pe-body-p">
              <span class="pe-dropcap">B</span>uku ini tidak lahir dari ruang kuliah ber-AC, perpustakaan sunyi yang berdebu, atau seminar motivasi berbayar dengan jaminan instan. Buku ini lahir dari obrolan-obrolan larut malam di warung kopi pinggir jalan Yogya, di bawah jembatan layang yang catnya mengelupas, dan di sudut Bento Kopi—di antara cangkir kopi tubruk yang mulai dingin, asap rokok tipis, dan hembusan angin malam yang menembus celana jeans.
            </p>

            <p class="pe-body-p">
              Mas Aldi berbicara tentang kompleksitas tubuh manusia, sains hormonal adrenal, neurologi, fisika kuantum, hingga falsafah wayang Jawa tanpa sedikit pun pretensi menggurui. Bukan sebagai kitab suci dengan semua jawaban, melainkan sebagai risalah obrolan jujur: rekaman percakapan santai yang menyentuh fondasi terdalam tentang bagaimana raga dan pikiran bawah sadar kita bekerja.
            </p>

            <p class="pe-body-p">
              Judul buku ini adalah pernyataan tentang waktu yang tak terduga. Hari ini mungkin hidupmu sedang lancar dan tenang. Namun kelak, ketika duniamu mendadak goyang dan kamu berdiri di persimpangan gelap tanpa arah, semua yang tersimpan di sudut memori dari lembaran-lembaran ini—tentang napas, hormon, gelombang otak, dan seni berserah—akan tiba-tiba kamu butuhkan.
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
