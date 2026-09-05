/**
 * SUATU SAAT v2 — Screen: Epilog (Catatan Penutup: Menjadi Manusia Normal)
 */
import { navigate } from "../router";
import { playPageTurn } from "../lib/audio";
import { PAGES } from "../data/book";

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
        </div>

        <!-- Floating Navigation Chevron (Left/Previous only, Vertically Centered in Screen) -->
        <button class="pe-chevron pe-chevron-prev" id="epilog-btn-prev" aria-label="Kembali ke Bab 5">
          <span>‹</span>
        </button>

        <!-- Bottom Editorial Content Box (55% Height) -->
        <div class="pe-content-box">
          <div class="pe-inner-content">
            <div class="pe-meta-header">
              <div class="pe-kicker">CATATAN PENUTUP</div>
              <h1 class="pe-title">Menjadi Manusia Normal</h1>
              <div class="pe-divider">✧</div>
            </div>

            <div class="pe-pullquote">
              <p class="pe-quote-text">“Kamu nggak perlu jadi orang suci. Kamu cuma perlu jadi manusia biasa yang hadir—yang beneran dengerin anaknya cerita, nemenin istrinya ngobrol, ngerjain kerjaannya dengan jujur. Itu aja sudah spiritualitas tertinggi.”</p>
              <span class="pe-quote-cite">— Mas Aldi</span>
            </div>

            <p class="pe-body-p">
              <span class="pe-dropcap">S</span>etelah melewati lima bab perjalanan dari anatomi raga hingga keterikatan kuantum, puncak spiritualitas sejati ternyata bukanlah kemampuan melayang, membaca masa depan, atau memamerkan sensasi batin di media sosial. Puncak pencapaian tertinggi adalah kemampuan untuk kembali menjadi manusia normal yang hadir seutuhnya di tengah kehidupan nyata.
            </p>

            <p class="pe-body-p">
              Sains tubuh dan teori kuantum tak ada artinya jika kita gagal hadir bagi orang-orang terkasih di rumah. Anak-anakmu tidak butuh ceramah medan torus saat mereka takut di malam hari, dan pasanganmu tidak butuh analisis gelombang otak saat letih bekerja. Yang mereka butuhkan hanyalah kehadiranmu: duduk bersahaja di samping mereka tanpa filter, mendengarkan dengan tulus, dan menghadapi hidup bersama.
            </p>

            <p class="pe-body-p">
              Buku ini selesai, tetapi laku hidupmu baru saja dimulai. Jadilah manusia biasa yang berusaha lebih baik sedikit demi sedikit—napas demi napas. Letakkan tanganmu di dada, tersenyumlah, dan pulanglah ke dalam rumah batinmu yang damai. Selamat jalan, kawan. Semoga selamat sampai tujuan.
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
      const lastPage = PAGES[PAGES.length - 1];
      navigate("read", { chap: lastPage.chapter_id, page: lastPage.page_in_chap });
    });

    const finish = () => {
      playPageTurn();
      navigate("cover");
    };

    this.el.querySelector("#epilog-btn-cta")?.addEventListener("click", finish);
  }

  public show(): void {
    this.el.classList.add("active");
  }

  public hide(): void {
    this.el.classList.remove("active");
  }
}
