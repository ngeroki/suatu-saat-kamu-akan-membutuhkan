/**
 * SUATU SAAT — Editorial Share Sheet & Story Card Canvas Generator
 * Enables 1-click sharing to WhatsApp Status, Instagram Story, and Social Media
 * with custom 1080x1920 9:16 Story Cards featuring fine-art visual + quote + branding.
 */
import { Page } from "../data/book";
import { showToast } from "../lib/toast";

export class ShareSheet {
  private container: HTMLElement;
  private el: HTMLElement | null = null;
  private isGenerating = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public open(page: Page): void {
    this.close();

    const layer = document.createElement("div");
    layer.className = "m-share-sheet-backdrop";
    layer.id = "m-share-sheet-backdrop";

    const quote = page.side_a_text || page.teaser || "";
    const pInChap = page.page_in_chap < 10 ? `0${page.page_in_chap}` : `${page.page_in_chap}`;
    const pGlobal = page.page_number < 10 ? `0${page.page_number}` : `${page.page_number}`;

    layer.innerHTML = `
      <div class="m-share-sheet" id="m-share-sheet" role="dialog" aria-modal="true">
        <!-- Top Ornament & Close -->
        <div class="m-share-top-ornament">
          <span class="m-share-tag">BAGIKAN LEMBARAN</span>
          <button type="button" class="m-share-dismiss-btn" id="m-share-btn-close" aria-label="Tutup">×</button>
        </div>

        <!-- Title & Subtitle -->
        <div class="m-share-header">
          <h3 class="m-share-title">Sebarkan Naskah & Karya Visual</h3>
          <p class="m-share-subtitle">Bab ${page.chapter_id} · Halaman ${pGlobal} (${pInChap})</p>
        </div>

        <!-- Miniature Card Preview -->
        <div class="m-share-preview-card">
          <div class="m-share-preview-thumb-wrap">
            <img src="${page.image_path}" alt="${page.title}" class="m-share-preview-thumb" />
            <div class="m-share-preview-gradient"></div>
            <div class="m-share-preview-badge">BAB ${page.chapter_id}</div>
          </div>
          <div class="m-share-preview-text">
            <div class="m-share-preview-heading">${page.title}</div>
            ${quote ? `<p class="m-share-preview-quote">"${quote}"</p>` : ""}
            <div class="m-share-preview-brand">SUATU SAAT · suatu-saat.pages.dev</div>
          </div>
        </div>

        <!-- Action Buttons List -->
        <div class="m-share-actions-list">
          <!-- Primary CTA: WhatsApp Native Share -->
          <button type="button" class="m-share-btn m-share-btn-wa" id="m-btn-share-native">
            <span class="m-share-btn-icon">💬</span>
            <div class="m-share-btn-text">
              <span class="m-share-btn-label">Bagikan ke WhatsApp Status / Cerita</span>
              <span class="m-share-btn-sub">Buka langsung aplikasi dengan kutipan & tautan</span>
            </div>
            <span class="m-share-btn-arrow">→</span>
          </button>

          <!-- Secondary CTA: Download 9:16 Story Card with Quote -->
          <button type="button" class="m-share-btn m-share-btn-story" id="m-btn-download-story">
            <span class="m-share-btn-icon">🎨</span>
            <div class="m-share-btn-text">
              <span class="m-share-btn-label" id="lbl-download-story">Unduh Kartu Story WA (9:16)</span>
              <span class="m-share-btn-sub">Lukisan 9:16 + kutipan refleksi untuk status</span>
            </div>
            <span class="m-share-btn-arrow">↓</span>
          </button>

          <!-- Tertiary CTA: Raw Wallpaper Download -->
          <button type="button" class="m-share-btn m-share-btn-wallpaper" id="m-btn-download-raw">
            <span class="m-share-btn-icon">🖼️</span>
            <div class="m-share-btn-text">
              <span class="m-share-btn-label">Unduh Lukisan Polos</span>
              <span class="m-share-btn-sub">Karya seni master murni untuk wallpaper ponsel</span>
            </div>
            <span class="m-share-btn-arrow">↓</span>
          </button>

          <!-- Copy Link -->
          <button type="button" class="m-share-btn m-share-btn-link" id="m-btn-copy-link">
            <span class="m-share-btn-icon">🔗</span>
            <div class="m-share-btn-text">
              <span class="m-share-btn-label">Salin Tautan Halaman</span>
              <span class="m-share-btn-sub">Bagikan tautan langsung ke lembaran ini</span>
            </div>
            <span class="m-share-btn-arrow">📋</span>
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(layer);
    this.el = layer;

    // Dismiss on click outside
    layer.addEventListener("click", (e) => {
      const sheet = layer.querySelector("#m-share-sheet");
      if (sheet && !sheet.contains(e.target as Node)) {
        this.close();
      }
    });

    // Close button
    layer.querySelector("#m-share-btn-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
    });

    // Wire Share Actions
    this.bindActions(page);
  }

  public close(): void {
    if (this.el) {
      this.el.remove();
      this.el = null;
    }
  }

  private bindActions(page: Page): void {
    if (!this.el) return;

    const pageUrl = `${window.location.origin}/#/read/${page.chapter_id}/${page.page_in_chap}`;
    const quote = page.side_a_text || page.teaser || "";
    const shareText = `"${quote}"\n\n— SUATU SAAT: Tubuh, Pikiran, Leluhur, dan Seni Berserah (Bab ${page.chapter_id})`;

    // Action 1: Native Share (WhatsApp Status / Cerita)
    this.el.querySelector("#m-btn-share-native")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (navigator.share) {
        try {
          await navigator.share({
            title: `SUATU SAAT — Bab ${page.chapter_id}`,
            text: `${shareText}\n\nBuka naskah & visual lengkap di:\n${pageUrl}`,
            url: pageUrl,
          });
          this.close();
          showToast("✓ Berhasil dibagikan!");
          return;
        } catch (err: any) {
          if (err?.name === "AbortError") return;
        }
      }

      // Fallback: Open WhatsApp directly
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\nBuka naskah & visual lengkap di:\n${pageUrl}`)}`;
      window.open(waUrl, "_blank");
      this.close();
      showToast("Membuka WhatsApp...");
    });

    // Action 2: Download 9:16 Story Card
    this.el.querySelector("#m-btn-download-story")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (this.isGenerating) return;
      this.isGenerating = true;

      const label = this.el?.querySelector("#lbl-download-story");
      if (label) label.textContent = "Menyiapkan Kartu Story...";

      try {
        const blob = await this.renderStoryCanvas(page);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `suatu-saat-bab-${page.chapter_id}-hal-${page.page_in_chap}-story.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        showToast("✓ Kartu Story berhasil diunduh!");
        this.close();
      } catch (err) {
        console.error("Gagal membuat kartu canvas:", err);
        showToast("Gagal membuat kartu story");
      } finally {
        this.isGenerating = false;
        if (label) label.textContent = "Unduh Kartu Story WA (9:16)";
      }
    });

    // Action 3: Download Raw Wallpaper
    this.el.querySelector("#m-btn-download-raw")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const a = document.createElement("a");
      a.href = page.image_path;
      a.download = `suatu-saat-lukisan-bab-${page.chapter_id}-hal-${page.page_in_chap}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("✓ Lukisan polos berhasil diunduh!");
      this.close();
    });

    // Action 4: Copy Page Link
    this.el.querySelector("#m-btn-copy-link")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(pageUrl);
        showToast("✓ Tautan lembaran berhasil disalin!");
        this.close();
      } catch (_) {
        showToast("Gagal menyalin tautan");
      }
    });
  }

  /**
   * Renders a 1080x1920 (9:16) Story Card on an HTML5 canvas.
   */
  private renderStoryCanvas(page: Page): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Cannot get canvas 2d context"));

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          // 1. Fill base dark charcoal
          ctx.fillStyle = "#0A0A08";
          ctx.fillRect(0, 0, 1080, 1920);

          // 2. Draw 9:16 cover image
          const imgAspect = img.width / img.height;
          const targetAspect = 1080 / 1920;
          let sWidth = img.width;
          let sHeight = img.height;
          let sx = 0;
          let sy = 0;
          if (imgAspect > targetAspect) {
            sWidth = img.height * targetAspect;
            sx = (img.width - sWidth) / 2;
          } else {
            sHeight = img.width / targetAspect;
            sy = (img.height - sHeight) / 2;
          }
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 1080, 1920);

          // 3. Multi-stop bottom vignette gradient
          const grad = ctx.createLinearGradient(0, 950, 0, 1920);
          grad.addColorStop(0, "rgba(10, 10, 8, 0)");
          grad.addColorStop(0.3, "rgba(10, 10, 8, 0.55)");
          grad.addColorStop(0.65, "rgba(10, 10, 8, 0.88)");
          grad.addColorStop(1, "rgba(10, 10, 8, 0.97)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 950, 1080, 970);

          // 4. Chapter badge
          ctx.fillStyle = "#C5A059";
          ctx.font = "600 24px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`BAB ${page.chapter_id} · HALAMAN ${page.page_number}`, 540, 1340);

          // 5. Title
          ctx.fillStyle = "#F4EFE6";
          ctx.font = "700 42px Cinzel, serif";
          ctx.textAlign = "center";
          this.wrapText(ctx, page.title.toUpperCase(), 540, 1400, 920, 54);

          // 6. Reflection Quote
          const quote = page.side_a_text || page.teaser || "";
          if (quote) {
            ctx.fillStyle = "#EDE4D8";
            ctx.font = "italic 32px Lora, serif";
            ctx.textAlign = "center";
            this.wrapText(ctx, `"${quote}"`, 540, 1500, 880, 48);
          }

          // 7. Subtle Hairline Divider
          ctx.strokeStyle = "rgba(197, 160, 89, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(380, 1750);
          ctx.lineTo(700, 1750);
          ctx.stroke();

          // 8. Brand Stamp & Signature
          ctx.fillStyle = "#C5A059";
          ctx.font = "600 24px Cinzel, serif";
          ctx.fillText("SUATU SAAT", 540, 1795);

          ctx.fillStyle = "#8C7662";
          ctx.font = "500 19px Inter, sans-serif";
          ctx.fillText("suatu-saat.pages.dev · @rahwanaconsciousnessroom", 540, 1835);

          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("toBlob returned null"));
          }, "image/png");
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${page.image_path}`));
      img.src = page.image_path;
    });
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {
    const words = text.split(" ");
    let line = "";
    let curY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, x, curY);
        line = words[i];
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, curY);
    }
  }
}
