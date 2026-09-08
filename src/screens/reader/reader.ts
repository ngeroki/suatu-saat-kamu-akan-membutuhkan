/**
 * SUATU SAAT v2 — Flipbook Reader with Peek Drawer (Bottom Sheet)
 * Mobile (<= 480px, Target: 390px): 9:16 Portrait Hero Poster + Warm Bone Paper Editorial Peek Drawer
 * Desktop (> 480px): Open-Book Two-Page Physical Spread
 */
import { PAGES, Page } from "../../data/book";
import { navigate, Route } from "../../router";
import { playPageTurn, playPaperSlide, isAudioEnabled, setAudioEnabled } from "../../lib/audio";
import { attachGestures, attachKeyboardNav } from "../../lib/gestures";
import { PagePicker } from "../../components/page-picker";
import { ShareSheet } from "../../components/share-sheet";
import { showToast } from "../../lib/toast";

const TUTORIAL_STORAGE_KEY = "suatu-saat:reader-tutorial-completed";
type TutorialStep = "flip" | "swipe" | "page-picker" | "completed";

export class ReaderScreen {
  private el: HTMLElement;
  private currentGlobalIndex = 0; // 0..73
  private activeSide: "A" | "B" = "A";
  private bookmarkedPages: Set<number> = new Set();
  private isFlipping = false;
  private pagePicker: PagePicker;
  private shareSheet: ShareSheet;
  private tutorialStep: TutorialStep = "completed";
  private tutorialSheetDismissed: boolean = false;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "screen";
    this.el.id = "screen-reader";
    this.el.style.width = "100%";
    this.el.style.height = "100%";
    this.el.style.overflow = "hidden";
    this.el.style.display = "flex";
    this.el.style.flexDirection = "column";

    container.appendChild(this.el);

    // Initialize tutorial state from sessionStorage (Per-Session)
    try {
      const isDone = sessionStorage.getItem(TUTORIAL_STORAGE_KEY);
      this.tutorialStep = isDone === "true" ? "completed" : "flip";
    } catch (_) {
      this.tutorialStep = "flip";
    }

    // Load persisted bookmarks from localStorage
    try {
      const savedBookmarks = localStorage.getItem("suatu_saat_bookmarks");
      if (savedBookmarks) {
        const parsed = JSON.parse(savedBookmarks);
        if (Array.isArray(parsed)) {
          this.bookmarkedPages = new Set(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load bookmarks:", e);
    }

    // Modular PagePicker component
    this.pagePicker = new PagePicker({
      container: this.el,
      onSelectPage: (idx) => this.goToPage(idx),
      onNavigate: (route) => navigate(route),
    });

    // Editorial Share Sheet & Story Card Generator
    this.shareSheet = new ShareSheet(this.el);

    // Gestures for swipe navigation (left / right for page turns)
    attachGestures(this.el, {
      onSwipeLeft: () => this.nextPage(),
      onSwipeRight: () => this.prevPage(),
    });

    // Keyboard navigation (arrow keys)
    attachKeyboardNav(
      () => this.prevPage(),
      () => this.nextPage()
    );

    // Re-render when window is resized across breakpoints
    window.addEventListener("resize", () => {
      if (this.el.classList.contains("active")) {
        this.render();
      }
    });
  }

  public show(route?: Route): void {
    this.el.classList.add("active");

    const requestedChap = Number(route?.params.chap ?? route?.params.chapter ?? 1);
    const requestedPageInChap = Number(route?.params.page ?? 1);

    const matchIndex = PAGES.findIndex(
      p => p.chapter_id === requestedChap && p.page_in_chap === requestedPageInChap
    );

    this.currentGlobalIndex = matchIndex >= 0 ? matchIndex : 0;
    try {
      localStorage.setItem("suatu_saat_last_page", String(this.currentGlobalIndex));
    } catch (_) {}

    // Check tutorial state on entry (Per-Session Tab: once per session or on-demand forced)
    try {
      if (sessionStorage.getItem("suatu-saat:reader-tutorial-force") === "true") {
        sessionStorage.removeItem("suatu-saat:reader-tutorial-force");
        this.tutorialSheetDismissed = false;
        this.tutorialStep = "flip";
      } else {
        const isDone = sessionStorage.getItem(TUTORIAL_STORAGE_KEY);
        if (isDone === "true") {
          this.tutorialStep = "completed";
        } else {
          // First time in this session: only show on opening page (Chapter 1 / Page 1)
          if (this.currentGlobalIndex === 0) {
            this.tutorialSheetDismissed = false;
            this.tutorialStep = "flip";
          } else {
            this.tutorialStep = "completed";
          }
        }
      }
    } catch (_) {
      this.tutorialStep = "completed";
    }

    const curPage = PAGES[this.currentGlobalIndex];
    // Chapter opener (page_in_chap === 1) shows Side A cover poster; subsequent content pages show Side B text directly
    this.activeSide = curPage && curPage.page_in_chap === 1 ? "A" : "B";
    this.render();
  }

  public hide(): void {
    if (this.pagePicker.opened) {
      this.pagePicker.close();
    }
    this.shareSheet.close();
    this.el.querySelector(".m-reader-tutorial-layer")?.remove();
    this.el.classList.remove("active");
  }

  public goToPage(index: number, direction?: "next" | "prev"): void {
    if (this.pagePicker.opened) {
      this.pagePicker.close();
    }
    this.shareSheet.close();
    if (index < 0 || index >= PAGES.length || index === this.currentGlobalIndex) return;
    if (this.isFlipping) return;

    const dir = direction ?? (index > this.currentGlobalIndex ? "next" : "prev");
    this.isFlipping = true;
    playPageTurn();

    const activeContent = (this.activeSide === "B"
      ? this.el.querySelector(".m-reading-stage")
      : this.el.querySelector(".m-poster-box")) as HTMLElement | null;

    if (activeContent) {
      activeContent.classList.add(dir === "next" ? "m-flip-out-next" : "m-flip-out-prev");
    }

    setTimeout(() => {
      this.currentGlobalIndex = index;
      try {
        localStorage.setItem("suatu_saat_last_page", String(this.currentGlobalIndex));
      } catch (_) {}
      const targetPage = PAGES[index];
      // Adaptive reading flow: opener shows Side A, subsequent content pages show Side B directly
      this.activeSide = targetPage && targetPage.page_in_chap === 1 ? "A" : "B";
      if (targetPage) {
        history.replaceState(null, "", `#/read/${targetPage.chapter_id}/${targetPage.page_in_chap}`);
      }
      this.render();

      const newActiveContent = (this.activeSide === "B"
        ? this.el.querySelector(".m-reading-stage")
        : this.el.querySelector(".m-poster-box")) as HTMLElement | null;

      if (newActiveContent) {
        newActiveContent.classList.add(dir === "next" ? "m-flip-in-next" : "m-flip-in-prev");
        setTimeout(() => {
          newActiveContent.classList.remove("m-flip-in-next", "m-flip-in-prev");
          this.isFlipping = false;
        }, 300);
      } else {
        this.isFlipping = false;
      }
    }, 160);
  }

  public nextPage(): void {
    if (this.tutorialStep === "swipe") {
      this.advanceTutorial("swipe");
    }
    if (this.currentGlobalIndex < PAGES.length - 1) {
      this.goToPage(this.currentGlobalIndex + 1, "next");
    } else {
      playPageTurn();
      navigate("epilog");
    }
  }

  public prevPage(): void {
    if (this.tutorialStep === "swipe") {
      this.advanceTutorial("swipe");
    }
    if (this.currentGlobalIndex > 0) {
      this.goToPage(this.currentGlobalIndex - 1, "prev");
    } else {
      playPageTurn();
      navigate("prolog");
    }
  }

  public flipToSide(side: "A" | "B"): void {
    if (this.activeSide === side || this.isFlipping) return;
    this.isFlipping = true;
    this.activeSide = side;
    playPaperSlide();

    if (this.tutorialStep === "flip") {
      this.advanceTutorial("flip");
    }

    const sheetContainer = this.el.querySelector(".m-sheet-container");
    if (sheetContainer) {
      if (side === "B") {
        sheetContainer.classList.remove("side-a-active");
        sheetContainer.classList.add("side-b-active");
      } else {
        sheetContainer.classList.remove("side-b-active");
        sheetContainer.classList.add("side-a-active");
      }
    }

    setTimeout(() => {
      this.isFlipping = false;
    }, 380);
  }

  public toggleBookmark(): void {
    const wasBookmarked = this.bookmarkedPages.has(this.currentGlobalIndex);
    if (wasBookmarked) {
      this.bookmarkedPages.delete(this.currentGlobalIndex);
      showToast("Penanda buku dihapus", 2200);
    } else {
      this.bookmarkedPages.add(this.currentGlobalIndex);
      showToast("★ Ditandai ke Penanda Buku", 3800, {
        label: "Buka Penanda",
        onClick: () => navigate("bab", { tab: "bookmarks" }),
      });
    }
    try {
      localStorage.setItem(
        "suatu_saat_bookmarks",
        JSON.stringify(Array.from(this.bookmarkedPages))
      );
    } catch (e) {
      console.warn("Failed to save bookmarks:", e);
    }
    this.render();
  }

  public toggleSound(): void {
    const nextState = !isAudioEnabled();
    setAudioEnabled(nextState);
    if (nextState) {
      playPaperSlide();
    }
    const icon = nextState ? "🔊" : "🔇";
    const title = nextState ? "Suara Efek: Aktif" : "Suara Efek: Senyap";

    this.el.querySelectorAll("#m-btn-sound-a, #m-btn-sound-b").forEach((btn) => {
      btn.setAttribute("title", title);
      const iconSpan = btn.querySelector(".m-icon");
      if (iconSpan) iconSpan.textContent = icon;
    });
  }

  private render(): void {
    const page = PAGES[this.currentGlobalIndex];
    if (!page) return;
    this.renderMobile(page);
  }

  // =========================================================================
  // MOBILE PEEK-DRAWER RENDERER (<= 480px, Target: 390px)
  // =========================================================================
  private renderMobile(page: Page): void {
    const isBookmarked = this.bookmarkedPages.has(this.currentGlobalIndex);
    const curNum = this.currentGlobalIndex + 1;
    const totalNum = PAGES.length;
    const progressPercent = ((curNum - 1) / Math.max(1, totalNum - 1)) * 100;
    const isFirst = this.currentGlobalIndex === 0;
    const isLast = this.currentGlobalIndex >= PAGES.length - 1;

    this.el.style.background = "#0A0A08";
    this.el.style.color = "#EDE4D8";

    // Group quotes and citations together cleanly
    const elements: string[] = [];
    let i = 0;
    while (i < page.paragraphs.length) {
      const p = page.paragraphs[i];
      const isQuote = p.startsWith('"') || p.startsWith('“') || p.startsWith("'");
      const nextP = i + 1 < page.paragraphs.length ? page.paragraphs[i + 1] : "";
      const nextIsCitation = nextP.startsWith("—") || nextP.startsWith("~") || nextP.startsWith("-") || nextP.startsWith("Aldi") || nextP.startsWith("Mas Aldi");

      if (isQuote) {
        let citationHTML = "";
        if (nextIsCitation) {
          const cleanCitation = nextP.replace(/^[—~–-]\s*/, "");
          citationHTML = `<cite class="m-quote-citation">${cleanCitation}</cite>`;
          i++; // Consume citation paragraph
        }
        elements.push(`
          <blockquote class="m-editorial-quote">
            <p class="m-quote-text">${p}</p>
            ${citationHTML}
          </blockquote>
        `);
      } else {
        if (elements.length === 0 && p.length > 20) {
          const firstChar = p.charAt(0);
          const rest = p.slice(1);
          elements.push(`<p class="m-editorial-p"><span class="m-dropcap">${firstChar}</span>${rest}</p>`);
        } else {
          elements.push(`<p class="m-editorial-p">${p}</p>`);
        }
      }
      i++;
    }
    const parasHTML = elements.join("");

    const isChapterGate = page.page_in_chap === 1;
    const chapterBrief = (page as any).chapter_brief || (
      page.chapter_id === 1 ? "Mengenal peta halus di dalam diri, tempat tubuh, pikiran, dan masa lalu bertemu." :
      page.chapter_id === 2 ? "Menembus samudra bawah sadar dan memprogram ulang cetak biru nasib." :
      page.chapter_id === 3 ? "Menyeimbangkan pabrik hormon biologis dan sains laku tirakat leluhur." :
      page.chapter_id === 4 ? "Menyingkap tenunan jala kosmik di balik ilusi keterpisahan manusia." :
      page.chapter_id === 5 ? "Menanggalkan topeng kesucian dan kembali menjadi manusia normal yang berserah." : ""
    );

    this.el.innerHTML = `
      <div class="mobile-reader-shell">
        <div class="m-sheet-container ${this.activeSide === 'B' ? 'side-b-active' : 'side-a-active'}">
          <!-- ========================================================= -->
          <!-- SIDE A: VISUAL FACE (Hero Poster 9:16 Uncropped + Tap to Flip) -->
          <!-- ========================================================= -->
          <div class="m-sheet-face m-face-a" id="m-face-a">
            <!-- Header Bar -->
            <header class="mobile-reader-header m-header-a">
              <button class="m-hdr-btn" id="m-btn-menu-a" aria-label="Daftar Bab & Isi">
                <span class="m-icon">☰</span>
              </button>
              <div class="m-hdr-title" id="m-hdr-title" role="button" tabindex="0" title="Kembali ke Beranda">SUATU SAAT</div>
              <div class="m-hdr-right" style="display: flex; align-items: center; gap: 6px;">
                <button class="m-hdr-btn" id="m-btn-help-a" aria-label="Petunjuk Membaca" title="Petunjuk Membaca" style="font-size: 13px; font-weight: 600; font-family: var(--sans); width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(235, 226, 214, 0.28); display: flex; align-items: center; justify-content: center; padding: 0; opacity: 0.85;">
                  <span class="m-icon" style="line-height: 1;">?</span>
                </button>
                <button class="m-hdr-btn" id="m-btn-sound-a" aria-label="Bisukan / Bunyikan Suara" title="${isAudioEnabled() ? 'Suara Efek: Aktif' : 'Suara Efek: Senyap'}">
                  <span class="m-icon">${isAudioEnabled() ? '🔊' : '🔇'}</span>
                </button>
                <span class="m-hdr-page" id="m-hdr-page-a" role="button" tabindex="0" title="Pilih Halaman" style="cursor: pointer; font-family: var(--sans); font-size: 11px; color: rgba(235, 226, 214, 0.85); font-weight: 500; display: inline-flex; align-items: center; gap: 3px; padding: 4px 6px; border-radius: 6px; transition: color 0.2s, background 0.2s;">
                  <span>${curNum} / ${totalNum}</span>
                  <span style="font-size: 9px; opacity: 0.6;">▾</span>
                </span>
                <button class="m-hdr-btn ${isBookmarked ? 'bookmarked' : ''}" id="m-btn-bookmark-a" aria-label="Simpan Penanda">
                  <span class="m-icon">${isBookmarked ? '★' : '🔖'}</span>
                </button>
              </div>
            </header>

            <!-- Visual Stage (Tap anywhere to flip to Side B) -->
            <main class="m-visual-stage" id="m-stage-a">
              <div class="m-poster-box" id="m-poster-box">
                <div class="m-poster-frame">
                  <img
                    src="${page.image_path}"
                    alt="${page.title}"
                    class="m-poster-img"
                    loading="eager"
                  />

                  <!-- Cinematic Vignette & Readability Scrim Overlay -->
                  <div class="m-poster-vignette"></div>

                  <!-- Editorial Typography Overlay (Side A Text & Artistic Reflection) -->
                  ${
                    isChapterGate
                      ? `
                  <div class="m-poster-overlay is-chapter-gate">
                    <div class="m-chapter-gate-wrap">
                      <div class="m-chapter-gate-num">BAB ${page.chapter_id}</div>
                      <div class="m-chapter-gate-divider"></div>
                      <h2 class="m-chapter-gate-title">${page.chapter_name.toUpperCase()}</h2>
                      <div class="m-chapter-gate-desc">${chapterBrief}</div>
                    </div>
                  </div>`
                      : `
                  <div class="m-poster-overlay">
                    <!-- Top Title & Subtitle (Centered, Clean without Bab/Halaman) -->
                    <div class="m-poster-meta-top">
                      <h2 class="m-poster-title">${page.title}</h2>
                      ${page.subtitle ? `<div class="m-poster-subtitle">${page.subtitle}</div>` : ""}
                      <div class="m-poster-title-divider"></div>
                    </div>

                    <!-- Lower Artistic Self-Reflection Statement -->
                    ${
                      page.side_a_text
                        ? `
                    <div class="m-poster-reflection-box">
                      <div class="m-art-flourish">
                        <span class="m-art-flourish-line"></span>
                        <span class="m-art-flourish-icon">✧</span>
                        <span class="m-art-flourish-line"></span>
                      </div>
                      <p class="m-poster-reflection-text">“${page.side_a_text}”</p>
                    </div>`
                        : ""
                    }
                  </div>`
                  }
                </div>

                <!-- Floating Chevrons: Left (<) and Right (>) -->
                <button class="m-chevron m-chevron-prev" id="m-btn-prev-a" aria-label="${isFirst ? 'Kembali ke Prolog' : 'Halaman Sebelumnya'}" title="${isFirst ? 'Kembali ke Prolog' : 'Halaman Sebelumnya'}">
                  <span>‹</span>
                </button>
                <button class="m-chevron m-chevron-next" id="m-btn-next-a" aria-label="${isLast ? 'Lanjut ke Epilog' : 'Halaman Selanjutnya'}" title="${isLast ? 'Lanjut ke Epilog' : 'Halaman Selanjutnya'}">
                  <span>›</span>
                </button>
              </div>

              <!-- Subtle Flip Cue & Share Pills -->
              <div class="m-stage-actions">
                <button type="button" class="m-flip-hint-pill" id="m-btn-flip-cue" aria-label="Baca Naskah" title="Balik ke naskah editorial">
                  <span class="m-hint-text">Baca Naskah →</span>
                </button>
                <button type="button" class="m-share-trigger-pill" id="m-btn-share-a" aria-label="Bagikan Cerita" title="Bagikan kartu cerita & ilustrasi ini">
                  <span class="m-hint-text">📤 Bagikan</span>
                </button>
              </div>
            </main>
          </div>

          <!-- ========================================================= -->
          <!-- SIDE B: READING FACE (Warm Bone Paper + Editorial Measure) -->
          <!-- ========================================================= -->
          <div class="m-sheet-face m-face-b" id="m-face-b">
            <!-- Header Bar (Mirrors Side A) -->
            <header class="mobile-reader-header m-header-b">
              <button class="m-hdr-btn" id="m-btn-menu-b" aria-label="Daftar Bab & Isi" style="color: #4A3A2A;">
                <span class="m-icon">☰</span>
              </button>
              <div class="m-hdr-title" id="m-hdr-title-b" role="button" tabindex="0" title="Kembali ke Beranda" style="cursor: pointer; color: #1E1A16;">SUATU SAAT</div>
              <div class="m-hdr-right" style="display: flex; align-items: center; gap: 6px;">
                <button class="m-hdr-btn" id="m-btn-help-b" aria-label="Petunjuk Membaca" title="Petunjuk Membaca" style="font-size: 13px; font-weight: 600; font-family: var(--sans); color: #7A6045; width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(122, 96, 69, 0.35); display: flex; align-items: center; justify-content: center; padding: 0; opacity: 0.85;">
                  <span class="m-icon" style="line-height: 1;">?</span>
                </button>
                <button class="m-hdr-btn" id="m-btn-sound-b" aria-label="Bisukan / Bunyikan Suara" title="${isAudioEnabled() ? 'Suara Efek: Aktif' : 'Suara Efek: Senyap'}" style="color: #4A3A2A;">
                  <span class="m-icon">${isAudioEnabled() ? '🔊' : '🔇'}</span>
                </button>
                <span class="m-hdr-page" id="m-hdr-page-b" role="button" tabindex="0" title="Pilih Halaman" style="cursor: pointer; font-family: var(--sans); font-size: 11px; color: #7A6045; font-weight: 600; display: inline-flex; align-items: center; gap: 3px; padding: 4px 6px; border-radius: 6px; transition: color 0.2s, background 0.2s;">
                  <span>${curNum} / ${totalNum}</span>
                  <span style="font-size: 9px; opacity: 0.6;">▾</span>
                </span>
                <button class="m-hdr-btn ${isBookmarked ? 'bookmarked' : ''}" id="m-btn-bookmark-b" aria-label="Simpan Penanda" style="color: #7A6045;">
                  <span class="m-icon">${isBookmarked ? '★' : '🔖'}</span>
                </button>
              </div>
            </header>

            <!-- Floating Chevrons: Left (<) and Right (>) matching Side A -->
            <button class="m-chevron m-chevron-prev" id="m-btn-prev-b" aria-label="${isFirst ? 'Kembali ke Prolog' : 'Halaman Sebelumnya'}" title="${isFirst ? 'Kembali ke Prolog' : 'Halaman Sebelumnya'}">
              <span>‹</span>
            </button>
            <button class="m-chevron m-chevron-next" id="m-btn-next-b" aria-label="${isLast ? 'Lanjut ke Epilog' : 'Halaman Selanjutnya'}" title="${isLast ? 'Lanjut ke Epilog' : 'Halaman Selanjutnya'}">
              <span>›</span>
            </button>

            <!-- Reading Body Stage (Tap anywhere to flip back to Side A) -->
            <main class="m-reading-stage" id="m-reading-stage" style="cursor: pointer; position: relative;">
              <div class="m-reading-container">
                <!-- Article Header -->
                <header class="m-article-header">
                  <div style="margin-bottom: 8px;">
                    <span class="m-hdr-b-chip">${page.chapter_code}</span>
                  </div>
                  <h1 class="m-article-title">${page.title}</h1>
                  ${page.subtitle ? `<div class="m-article-subtitle">${page.subtitle}</div>` : ''}
                  <div class="m-article-ornament">✧ ✦ ✧</div>
                </header>

                <!-- Full Paragraphs & Quotes (text-align: left, generous measure) -->
                <div class="m-editorial-body">
                  ${parasHTML}
                </div>

                <!-- Clean Editorial End Marker (stepper & duplicate page count removed) -->
                <footer class="m-reading-footer" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(122, 96, 69, 0.18); text-align: center; padding-bottom: 36px;">
                  <div class="m-reading-footer-brand">SUATU SAAT · KESADARAN NUSANTARA</div>
                </footer>
              </div>
            </main>

            <!-- Subtle Flip Cue Pill -->
            <button type="button" class="m-flip-hint-pill m-flip-hint-pill-b" id="m-btn-flip-cue-b" aria-label="Lihat Ilustrasi" title="Balik ke karya visual">
              <span class="m-hint-text">Lihat Ilustrasi ↺</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind Mobile DOM Events
    this.bindMobileEvents();
    this.updateTutorialUI();
  }

  private bindMobileEvents(): void {
    // Menu (TOC / Bab List) from Side A and Side B
    this.el.querySelector("#m-btn-menu-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("bab");
    });
    this.el.querySelector("#m-btn-menu-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("bab");
    });

    // "Suatu Saat" in navbar -> Navigate back to homepage
    this.el.querySelector("#m-hdr-title")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("cover");
    });
    this.el.querySelector("#m-hdr-title-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate("cover");
    });

    // Petunjuk Membaca (?) Button -> Re-trigger tutorial on demand
    this.el.querySelector("#m-btn-help-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.startTutorial();
    });
    this.el.querySelector("#m-btn-help-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.startTutorial();
    });

    // Bookmarks on Side A and Side B
    this.el.querySelector("#m-btn-bookmark-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleBookmark();
    });
    this.el.querySelector("#m-btn-bookmark-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleBookmark();
    });

    // Sound Toggle on Side A and Side B
    this.el.querySelector("#m-btn-sound-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleSound();
    });
    this.el.querySelector("#m-btn-sound-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleSound();
    });

    // Page Number Click -> Toggle Instant Page Picker Popover
    this.el.querySelector("#m-hdr-page-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.togglePagePicker();
    });
    this.el.querySelector("#m-hdr-page-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.togglePagePicker();
    });

    // Side A Chevrons (Previous / Next page)
    this.el.querySelector("#m-btn-prev-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.prevPage();
    });
    this.el.querySelector("#m-btn-next-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextPage();
    });

    // Side B Chevrons (Previous / Next page)
    this.el.querySelector("#m-btn-prev-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.prevPage();
    });
    this.el.querySelector("#m-btn-next-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextPage();
    });

    // Side A Flip Trigger (Tap poster stage to flip to Side B)
    const stageA = this.el.querySelector("#m-stage-a");
    stageA?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".m-chevron")) return;
      this.flipToSide("B");
    });

    // Side B Flip Trigger (Tap reading stage to flip back to Side A)
    const stageB = this.el.querySelector("#m-reading-stage");
    stageB?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".m-chevron") || target.closest("button") || target.closest("a")) return;
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) return;
      this.flipToSide("A");
    });

    // Explicit Flip Cue Pill Buttons ("Baca naskah" & "Lihat Ilustrasi")
    this.el.querySelector("#m-btn-flip-cue")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.flipToSide("B");
    });
    this.el.querySelector("#m-btn-flip-cue-b")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.flipToSide("A");
    });

    // Share Sheet Button on Side A
    this.el.querySelector("#m-btn-share-a")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const curPage = PAGES[this.currentGlobalIndex];
      if (curPage) {
        this.shareSheet.open(curPage);
      }
    });
  }

  // =========================================================================
  // PAGE PICKER DELEGATION
  // =========================================================================
  public togglePagePicker(): void {
    if (this.tutorialStep === "page-picker") {
      this.advanceTutorial("page-picker");
    }
    this.pagePicker.toggle(this.currentGlobalIndex);
  }

  // =========================================================================
  // READER TUTORIAL (Thin, Non-blocking Ink Guidance)
  // =========================================================================
  public startTutorial(): void {
    try {
      sessionStorage.removeItem(TUTORIAL_STORAGE_KEY);
    } catch (_) {}
    this.tutorialSheetDismissed = false;
    if (this.activeSide === "B") {
      this.tutorialStep = "completed";
      this.flipToSide("A");
    }
    this.tutorialStep = "flip";
    this.updateTutorialUI();
  }

  private advanceTutorial(expectedStep: TutorialStep): void {
    if (this.tutorialStep !== expectedStep) return;

    if (expectedStep === "flip") {
      this.tutorialStep = "swipe";
    } else if (expectedStep === "swipe") {
      this.tutorialStep = "page-picker";
    } else if (expectedStep === "page-picker") {
      this.tutorialStep = "completed";
      try {
        sessionStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
      } catch (_) {}
    }

    this.updateTutorialUI();
  }

  public completeTutorial(): void {
    this.tutorialStep = "completed";
    try {
      sessionStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    } catch (_) {}
    this.updateTutorialUI();
  }

  private updateTutorialUI(): void {
    const existingLayer = this.el.querySelector(".m-reader-tutorial-layer");

    if (this.tutorialStep === "completed") {
      existingLayer?.remove();
      return;
    }

    let layer = existingLayer as HTMLElement | null;
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "m-reader-tutorial-layer";
      this.el.appendChild(layer);
    }

    // Phase 1: The Editorial Bookmark Sheet (Clean Dark Vignette Scrim, ZERO BLUR)
    if (!this.tutorialSheetDismissed) {
      layer.className = "m-reader-tutorial-layer";
      layer.onclick = null;
      layer.innerHTML = `
        <div class="m-bookmark-sheet" id="m-bookmark-sheet">
          <div class="m-bookmark-top-ornament">
            <span class="m-bookmark-tag">PANDUAN MEMBACA</span>
            <button type="button" class="m-bookmark-dismiss-btn" id="m-bookmark-close" aria-label="Tutup Panduan">×</button>
          </div>
          
          <div class="m-bookmark-header-wrap">
            <h3 class="m-bookmark-title">Dua Muka Tiap Lembaran</h3>
            <p class="m-bookmark-subtitle">Setiap lembar menyimpan visual di muka depan dan naskah di muka belakang.</p>
          </div>

          <div class="m-bookmark-gestures">
            <div class="m-bkmk-row">
              <div class="m-bkmk-badge">↺</div>
              <div class="m-bkmk-content">
                <span class="m-bkmk-heading">Ketuk Lembar</span>
                <p class="m-bkmk-desc">Balik lembar 3D antara Visual (Sisi A) dan Naskah Baca (Sisi B).</p>
              </div>
            </div>

            <div class="m-bkmk-row">
              <div class="m-bkmk-badge">‹ ›</div>
              <div class="m-bkmk-content">
                <span class="m-bkmk-heading">Usap Layar</span>
                <p class="m-bkmk-desc">Geser ke kiri atau kanan untuk berpindah antar halaman naskah.</p>
              </div>
            </div>

            <div class="m-bkmk-row">
              <div class="m-bkmk-badge">✧</div>
              <div class="m-bkmk-content">
                <span class="m-bkmk-heading">Lompat Bab</span>
                <p class="m-bkmk-desc">Ketuk nomor halaman di atas untuk daftar isi & audio pembacaan.</p>
              </div>
            </div>
          </div>

          <div class="m-bkmk-mobile-note">
            <span class="m-bkmk-mobile-icon">📱</span>
            <span>Buku ini dirancang khusus untuk layar ponsel 9:16. Pengalaman visual, efek audio, dan gestur paling utuh tersaji di smartphone.</span>
          </div>

          <button type="button" class="m-bookmark-btn-start" id="m-btn-start-reading-guide">
            <span>Buka Lembaran Buku</span>
            <span>→</span>
          </button>
          <div class="m-bookmark-hint-footer">Ketuk tombol untuk mencoba langsung di atas lembaran</div>
        </div>
      `;

      // Close / skip button
      layer.querySelector("#m-bookmark-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.completeTutorial();
      });

      // Start reading guide button
      layer.querySelector("#m-btn-start-reading-guide")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.tutorialSheetDismissed = true;
        this.updateTutorialUI();
      });

      // Clicking scrim outside bookmark sheet also enters interactive cue mode
      layer.onclick = (e) => {
        const sheet = layer?.querySelector("#m-bookmark-sheet");
        if (sheet && !sheet.contains(e.target as Node)) {
          this.tutorialSheetDismissed = true;
          this.updateTutorialUI();
        }
      };
      return;
    }

    // Phase 2: Subtle In-Page Interactive Ink Cues (Transparent background, Zero intrusion)
    layer.className = `m-reader-tutorial-layer is-cue-only m-tut-step-${this.tutorialStep}`;
    layer.onclick = null;

    if (this.tutorialStep === "flip") {
      layer.innerHTML = `
        <div class="m-tut-cue-wrap">
          <div class="m-tut-cue-pill" id="m-tut-cue-action" role="button" tabindex="0">
            <span class="m-tut-cue-icon">↺</span>
            <span class="m-tut-cue-text">Ketuk lembaran untuk membalik ke naskah</span>
            <span class="m-tut-cue-close" id="m-tut-btn-skip" role="button" aria-label="Lewati panduan" title="Lewati">×</span>
          </div>
        </div>
      `;

      layer.querySelector("#m-tut-cue-action")?.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("#m-tut-btn-skip")) return;
        e.stopPropagation();
        this.flipToSide("B");
      });
    } else if (this.tutorialStep === "swipe") {
      layer.innerHTML = `
        <div class="m-tut-cue-wrap">
          <div class="m-tut-cue-pill" id="m-tut-cue-action" role="button" tabindex="0">
            <span class="m-tut-cue-icon">‹ ›</span>
            <span class="m-tut-cue-text">Usap layar untuk beralih lembaran</span>
            <span class="m-tut-cue-close" id="m-tut-btn-skip" role="button" aria-label="Lewati panduan" title="Lewati">×</span>
          </div>
        </div>
      `;

      layer.querySelector("#m-tut-cue-action")?.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("#m-tut-btn-skip")) return;
        e.stopPropagation();
        this.nextPage();
      });
    } else if (this.tutorialStep === "page-picker") {
      layer.innerHTML = `
        <div class="m-tut-cue-wrap m-tut-picker-wrap">
          <div class="m-tut-cue-arrow-up"></div>
          <div class="m-tut-cue-pill" id="m-tut-cue-action" role="button" tabindex="0">
            <span class="m-tut-cue-icon">✧</span>
            <span class="m-tut-cue-text">Ketuk nomor halaman untuk daftar bab</span>
            <span class="m-tut-cue-close" id="m-tut-btn-skip" role="button" aria-label="Lewati panduan" title="Lewati">×</span>
          </div>
        </div>
      `;

      layer.querySelector("#m-tut-cue-action")?.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("#m-tut-btn-skip")) return;
        e.stopPropagation();
        this.togglePagePicker();
      });
    }

    layer.querySelector("#m-tut-btn-skip")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.completeTutorial();
    });
  }

}
