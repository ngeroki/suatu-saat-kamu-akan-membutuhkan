# Opsi B — 74-Page Sacred Core Calibration & Editorial Bookends Architecture

> **Supervisory Architecture Plan (Approved)**
> - **Antigravity [AG] (Lead Architect)**: Data pipeline design, editorial provenance, visual & narrative continuity, headless QA supervisor.
> - **OpenCode Sisyphus [OMO] (Worker)**: Sequential packing execution, provenance tagging, test harness execution.

---

## 🏛️ Filosofi & Prinsip Inti

1. **74 Halaman = Sacred Core (Pagination Engine)**
   - Bab 1: 15 hal | Bab 2: 15 hal | Bab 3: 15 hal | Bab 4: 14 hal | Bab 5: 15 hal = Tepat 74 Halaman.
   - Prolog dan Epilog adalah **Bookends**, berada di luar pagination engine 74 halaman.
2. **Soft Target Kepadatan (Bukan Hukum Matematika Kaku)**
   - **Ideal**: 130–145 kata.
   - **Acceptable Window**: 120–150 kata.
   - **Natural Ending Tolerance**: Sub-bab pendek (~95–115 kata) yang berakhir secara natural dibiarkan bernapas. DILARANG meminjam kalimat dari sub-bab lain demi mengejar angka.
   - **Warning Zone**: <110 kata (terlalu kopong) atau >160 kata (terancam tumpah/scroll).
3. **The Gold Standard QA**: **Rendered Card Height @ 390px**
   - Bukan sekadar word count. Kebenaran tertinggi adalah: `card.scrollHeight <= card.clientHeight` di viewport iPhone 390x844 dengan *breathing room* visual terjaga.
4. **Sentence Integrity Invariant**
   - DILARANG memotong kata di tengah jalan (`words[:-reduction]`). Pemotongan paragraf HANYA boleh terjadi pada batas tanda penutup kalimat yang sah: `[.!?]["'”)]?`.
5. **Naskah Asli Suci & Read-Only (`R:\flip-book\naskah-buku\`)**
   - Korpus asli tidak boleh diubah formatnya.

---

## 📐 Arsitektur Pipeline

```text
NASKAH ASLI (Bab 1–5)
         ↓
1. Sanitization Gate (Strip ``` code fences, ASCII art box ┌──┐, tables, metadata)
         ↓
2. Hierarchy Parser (Extract ## and ### sub-sections with paragraph indices)
         ↓
3. Sequential Binding (Bind section → designated page range 1..74)
         ↓
4. Sequential Sentence Packing (Greedy fill with sentence-boundary invariant)
         ↓
5. Soft Overflow Tolerance (Keep natural endings, reject cross-section pollution)
         ↓
6. Provenance & Continuity Tagging:
     ├── source_section, source_paragraph_start, source_paragraph_end
     ├── narrative_role: setup | development | insight | practice | synthesis
     ├── transition: continues | deepens | shifts | resolves
     └── visual continuity: prev_visual, current_subject, environment, mood
         ↓
7. Integrity + Headless Rendered Height QA (390x844 Playwright)
         ↓
src/data/book-pages.json (Canonical 74-page dataset)
```

---

## 📖 Bookends Specification (Prolog & Epilog)

Prolog dan Epilog BUKAN artikel scroll 350 kata, melainkan **Editorial 1-Screen Landmark**:
- **Prolog (`src/screens/prolog.ts`)**:
  - 1 Hero Illustration (45% upper visual)
  - Short Title: *Sebuah Risalah Obrolan*
  - 100–180 kata *distilled essence* naskah pembuka
  - 1 Memorable Pull Quote
  - Tombol CTA: "Mulai Membaca Bab 1 ›"
- **Epilog (`src/screens/epilog.ts`)**:
  - 1 Closing Illustration (45% upper visual)
  - Short Title: *Aku Telah Pulang*
  - 100–180 kata *distilled essence* penutup (Puncak: Manusia Normal & Welas Asih)
  - 1 Final Sacred Quote
  - Tombol CTA: "Kembali ke Beranda"

---

## 🔍 4 Quality Gates (QA Metrics)

### 1. Page Word Count & Density
- Target range: 120–150 kata (ideal 130–145).
- Toleransi ending alami: >= 95 kata jika sub-bab tuntas.
- Flag warning jika < 110 atau > 160 kata.

### 2. Sentence Integrity
- Semua paragraf wajib berakhir dengan tanda baca resmi: `[.!?]["'”)]?`.
- Zero broken sentences / zero dangling words.

### 3. Section Provenance (Audit Trail)
Setiap entri halaman di `src/data/book-pages.json` wajib menyertakan:
```json
"provenance": {
  "source_chapter": 1,
  "source_section": "2. Kita Adalah Makhluk Energi yang Memadat",
  "source_paragraph_start": 3,
  "source_paragraph_end": 5
}
```

### 4. Narrative & Visual Continuity
Setiap halaman wajib memiliki:
```json
"continuity": {
  "narrative_role": "insight",
  "transition": "deepens",
  "prev_visual": "Warkop underbridge malam, cangkir tubruk mengepul",
  "current_subject": "Medan Torus Jantung memancar melampaui raga",
  "environment": "Ruang hening minimalis gelap dengan aksen garis emas",
  "mood": "Reverent, sacred anatomy, keheningan ilmiah"
}
```

### 5. Headless Rendered Height Check (Playwright 390x844)
- Buka seluruh 74 halaman di headless browser.
- Assert: `.page-body-card` atau `.pe-body-box` tidak memicu *unwanted vertical scrollbar* (`element.scrollHeight <= element.clientHeight + 4px`).
- Assert: visual *breathing room* dan footer takeaway terlihat utuh.
