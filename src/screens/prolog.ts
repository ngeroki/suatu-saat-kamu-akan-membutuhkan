/**
 * SUATU SAAT v2 — Screen: Prolog (Kata Pengantar: Obrolan di Pinggir Jalan)
 */
import { navigate } from "../router";
import { playPageTurn } from "../lib/audio";
import { PAGES } from "../data/book";
import { PagePicker } from "../components/page-picker";

export class PrologScreen {
  private el: HTMLElement;
  private pagePicker: PagePicker;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen screen-prolog";
    this.el.id = "screen-prolog";

    this.pagePicker = new PagePicker({
      container: this.el,
      onSelectPage: (idx) => {
        const targetPage = PAGES[idx];
        if (targetPage) {
          navigate("read", { chap: targetPage.chapter_id, page: targetPage.page_in_chap });
        }
      },
      onNavigate: (route) => navigate(route),
    });

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
          <button class="pe-hdr-page" id="pe-btn-page" role="button" tabindex="0" title="Pilih Halaman">
            <span class="pe-hdr-page-text">PROLOG</span>
            <span class="pe-hdr-page-arrow">▾</span>
          </button>
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
              <h1 class="pe-title">Sinau Bareng, Menatap Diri</h1>
              <div class="pe-divider">✧</div>
            </div>

            <div class="pe-pullquote">
              <p class="pe-quote-text">“Kita ngobrol ya, nggak usah serius-serius amat. Yang penting jujur. Nanti juga kalau sudah waktunya kamu butuh, semua yang kita omongkan ini bakal nyambung sendiri di dalam dadamu.”</p>
            </div>

            <p class="pe-body-p">
              <span class="pe-dropcap">H</span>eh, kamu ke sini ini sebetulnya lagi nyari apa to? Mau nyari rumus sakti biar nasibmu berubah drastis besok pagi? Di sini tidak ada panggung megah berlampu sorot warna-warni yang bikin silau mata. Tidak ada spanduk seminar motivasi yang teriak-teriak menyuruhmu sukses kaya raya dalam tiga puluh hari. Malam ini, kita lepaskan dulu semua jubah kepalsuan. Kita duduk melingkar beralas tikar, sebagai sesama manusia yang sama-sama pernah tersandung batu, pernah menangis di pojokan karena remuk hatinya, dan sekarang mau diajak berpikir jujur.
            </p>

            <p class="pe-body-p">
              Buku ini posisinya cuma mau jadi kayu lapuk buat orang yang tenggelam di laut. Saya tidak mau bersikap seperti guru besar yang duduk di atas menara gading sambil menasihati orang-orang di pelataran dengan nada menghakimi. Anggap saja saya ini kawanmu yang kebetulan menemukan sesuatu yang sangat menarik di balik semak belukar, lalu menarik lengan bajumu sambil bilang, "Ayo sini sebentar, coba kamu tengok sendiri ke dalam."
            </p>

            <p class="pe-body-p">
              Suatu saat nanti, pada hari yang tidak pernah tercantum di kalender mana pun, kamu mungkin bakal berdiri di persimpangan jalan yang gelap gulita. Rencana besarmu ambruk dalam semalam, dan kamu merasa terasing dari dirimu sendiri. Di saat kepalamu buntu dan lidahmu kelu untuk berdoa, obrolan kita ini akan mendadak menyala kembali di dalam dadamu. Pada detik itulah, kamu akan mengerti kenapa buku ini diberi judul Suatu Saat Kamu Akan Membutuhkan.
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

    this.el.querySelector("#pe-btn-page")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.pagePicker.toggle(0);
    });

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
    if (this.pagePicker.opened) {
      this.pagePicker.close();
    }
    this.el.classList.remove("active");
  }
}
