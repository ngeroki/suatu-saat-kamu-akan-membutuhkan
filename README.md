# 📖 SUATU SAAT — Mobile Digital Flipbook

Web application digital art book interaktif bertema spiritualitas, sains tubuh, dan kearifan Nusantara karya **Aldi** (`@rahwanaconsciousnessroom`).

- **Live Repository**: [https://github.com/ngeroki/suatu-saat-kamu-akan-membutuhkan](https://github.com/ngeroki/suatu-saat-kamu-akan-membutuhkan)
- **Local Workspace**: `R:\flip-book`
- **Target Device**: Mobile-first (iPhone 390×844, 360px, 430px) + Two-Page Physical Desktop Spread

---

## 🏛️ Arsitektur Dual-Workspace (Pemisahan Dapur vs Galeri)

Proyek ini sengaja dipisahkan menjadi dua ruang kerja terpisah untuk menjaga kebersihan kode dan performa:

1. **`R:\flip-book` (Direktori Ini - Galeri / Aplikasi Produksi)**:
   - Aplikasi web Vite SPA murni dengan 3D page flip physics, sintesis audio kertas Web Audio API, dan kurasi 74 halaman naskah.
   - Terhubung langsung ke branch `master` di GitHub.
   - Seluruh pengembangan UI, pembacaan naskah, dan styling dikerjakan di sini.

2. **`R:\suatu-saat-kamu-akan-membutuhkan` (Dapur Riset & Arsip)**:
   - Gudang bahan mentah: 42 transkrip mentah (TikTok & offline audio), file rekaman audio, pipeline ekstraksi, dan eksperimen RAG.
   - Tidak digunakan untuk pengembangan antarmuka pembaca.

---

## 🚀 Menjalankan Aplikasi

```bash
# Install dependensi
npm install

# Jalankan server dev lokal
npm run dev

# Build produksi
npm run build

# Preview build produksi
npm run preview
```

---

## 📊 Spesifikasi Teknis
- **Vite 6** + **TypeScript** (Zero bloat, build < 400ms)
- **Audio Engine**: Web Audio API (zero latency, randomized pitch authentic paper sounds)
- **Naskah**: 5 Bab, 74 Halaman, 9.531 kata terkurasi sekuensial 1-to-1 dari naskah asli
- **Visual**: 74 ilustrasi portrait 9:16 Nusantara Editorial Palette
