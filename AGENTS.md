# 🤖 AGENTS.MD — TATA KELOLA & KOORDINASI AI WORKSPACE

Selamat datang di workspace **SUATU SAAT** (`R:\flip-book`).

---

## 🏛️ Arsitektur Dual-Workspace (Pemisahan Dapur vs Galeri)
Untuk menjaga kebersihan kode dan menghindari *context pollution* pada agen AI, proyek ini dibagi menjadi dua direktori terpisah dengan tanggung jawab tegas:

1. **`R:\flip-book` (Galeri / Aplikasi Web Produksi)**:
   - **Fungsi**: Webapp digital flipbook SPA utama (Vite + TypeScript + 3D page flip engine).
   - **Isi**: Naskah kurasi 74 halaman (`naskah-buku/`), aset visual potret 9:16, data flipbook (`src/data/book-pages.json`), dan layar baca mobile-first.
   - **GitHub Remote**: `https://github.com/ngeroki/suatu-saat-kamu-akan-membutuhkan` (branch `master`).
   - **Aturan**: Seluruh pengembangan UI, tipografi, dan navigasi pembaca **WAJIB** dikerjakan di direktori ini.
2. **`R:\suatu-saat-kamu-akan-membutuhkan` (Dapur Riset & Arsip Bahan Mentah)**:
   - **Fungsi**: Gudang penyimpanan bahan mentah, riset, dan eksperimen data.
   - **Isi**: 42 transkrip mentah (TikTok & offline audio), file rekaman audio, pipeline RAG, dan skrip scraping.
   - **Aturan**: Dilarang mengembangkan aplikasi web di folder ini. Naskah hasil olahan yang sudah matang di sana disalin ke `R:\flip-book\naskah-buku\`.

---

## 🏛️ Filosofi Proyek & Prinsip Utama
1. **Naskah Asli Adalah Satu-satunya Sumber Kebenaran**:
   - Sumber korpus berada di `R:\flip-book\naskah-buku`.
   - **Haram merekayasa, memotong, atau mengarang konten naskah**. Seluruh judul bab, takarir, dan struktur 74 halaman naskah harus bersumber langsung dari naskah asli.
2. **Mobile First Tanpa Kompromi**:
   - Target utama: 390px (iPhone 12/13/14/15 standard).
   - Wajib berjalan sempurna pada 360px dan 430px.
   - Desktop hanya berfungsi sebagai simulator frame device & inspection tool.
3. **Estetika Nusantara Editorial (Anti-SaaS)**:
   - Dilarang keras menggunakan neon, purple gradient, cards generic SaaS, atau glassmorphism murah.
   - Gunakan palet earthy: Charcoal `#11110F`, Bone Paper `#F9F6F0`, Earth `#7A6045`, Terracotta `#8B4E3C`, Sage `#55624F`, Gold `#C5A059`.

---

## 👥 Pembagian Peran Cross-Agent (`[AG]` + `[OMO]`)
- **Antigravity `[AG]` (Lead Architect / UI Supervisor)**:
  - Merancang arsitektur interaksi, arahan visual, prompt generasi gambar via `gemini-image-gen`, review kode, dan verifikasi visual.
- **OpenCode Sisyphus `[OMO]` (Heavy Worker)**:
  - Eksekusi perubahan kode besar, refactoring, batch data processing, dan penulisan skrip otomasi.
  - Sesi aktif: `ses_f9de86d2cffeEHvpVqiwq3HP1P`.

---

## 🔄 Two-Doc State Protocol
Sebelum mengakhiri sesi, AI wajib memperbarui:
1. `RESUME.md` (Konteks cepat & bootloader).
2. `PROJECT_STATUS.md` (Dashboard milestone dan backlog).
