# Design Specification: Desktop Centered Mobile Column & Reader Unification

## 1. Latar Belakang & Masalah
Saat ini, aplikasi web SUATU SAAT memiliki dua jalur rendering di `ReaderScreen`:
- Mobile (`<= 480px`): Pengalaman kartu vertikal 9:16 potret (Side A Visual ↔ Side B Reading), gestur flip 3D, dan drawer.
- Desktop (`> 480px`): Mencoba memaksakan model *two-page open-book spread* melebar (halaman kiri teks, halaman kanan lukisan).

Pada resolusi desktop/laptop, tampilan buku terbuka ini proporsinya sangat terdistorsi ("ancur"):
1. Lukisan 9:16 potret menjadi terjepit atau terpotong jika dipaksa bersanding dengan halaman teks lebar.
2. Teks naskah di halaman kiri menjadi terlalu rapat dan bergulir canggung.
3. Fitur modern (tutorial kartu pembatas buku, share sheet, tap to flip) tidak seragam antara mobile dan desktop.
4. Kode bercabang ganda menambah kompleksitas pemeliharaan.

Pengguna menyetujui **Opsi 2**: Mengunci aplikasi secara mobile-first di semua ukuran layar dengan menempatkan kolom bacaan terpusat (*Centered Mobile Column, `max-width: 430px`*) berlatar belakang gelap hening di desktop, serta menghapus total kode spread desktop yang rusak.

---

## 2. Arsitektur Wadah Aplikasi (`#app` & `.device`)

### A. Layout Container di Desktop
Pada `src/style.css`:
- `#app`:
  - `width: 100vw; height: 100dvh;`
  - `background: #070706;` (Latar hening di luar kolom)
  - `display: flex; align-items: center; justify-content: center;`
  - `overflow: hidden;`
- `.device`:
  - `width: 100%; height: 100%;`
  - `max-width: 430px;` (Sesuai batas lebar iPhone 14/15 Pro Max & flagship Android)
  - `background: var(--charcoal);`
  - `position: relative; overflow: hidden;`
  - `box-shadow: 0 0 60px rgba(0, 0, 0, 0.85);` (Ambient edge shadow yang memisahkan kolom dari latar luar)

---

## 3. Unifikasi Pembaca (`ReaderScreen`)

### A. Eliminasi Jalur Rendering Ganda
Pada `src/screens/reader/reader.ts`:
- Di metode `render()`, hapus percabangan `isMobile ? renderMobile() : renderDesktop()`.
- Selalu panggil `this.renderMobile(page)` di SEMUA ukuran layar.
- Hapus metode usang `renderDesktop()` dan `bindDesktopEvents()`.
- Hapus variabel dan animasi curl desktop yang tidak lagi digunakan (`.physical-book-spread`, `d-flip-out-next`, dll.).

### B. Interaksi di Layar Lebar
- Pengguna desktop kini mendapatkan 100% fitur mobile yang sempurna:
  - Side A: Poster vertikal 9:16, tipografi monumental, tombol chevrons kiri/kanan, `[ Baca Naskah → ]`, dan `[ 📤 Bagikan ]`.
  - Side B: Naskah *Warm Bone Paper*, tipografi terukur nyaman dibaca, drop cap, tombol `[ Lihat Ilustrasi ↺ ]`.
  - Interaksi: Klik mouse / tap untuk membalik Side A ↔ Side B, klik chevrons atau tekan tombol panah keyboard (`←` dan `→`) untuk ganti halaman.
  - Modal & Sheet: PagePicker, ShareSheet, dan Toast otomatis berpusat rapi di dalam kolom 430px.

---

## 4. Pembersihan CSS
Pada `src/style.css`:
- Hapus blok gaya usang `.desktop-reader-shell`, `.physical-book-spread`, `.spread-page-left`, `.spread-page-right`, `.nav-track-bar`, dll.
- Pastikan seluruh layar (Cover, Prolog, BabList, Reader, Epilog) rapi di dalam batas `430px`.

---

## 5. Rencana Pengujian
1. **TypeScript & Build**: `npm run build` lolos 0 error.
2. **Playwright Desktop Test (`1280x800`)**:
   - Membuka `#/read/1/1` di viewport desktop 1280x800.
   - Memastikan `#device` memiliki `max-width: 430px` dan terpusat di layar.
   - Memastikan `.mobile-reader-shell` aktif (bukan desktop spread).
   - Memastikan Side A, Side B, flip cue, dan navigasi berfungsi mulus.
   - Mengambil screenshot visual desktop untuk membuktikan estetika kolom terpusat.
3. **Playwright Mobile Test (`390x844`)**:
   - Memastikan tampilan mobile tidak terpengaruh dan tetap 100% sempurna memenuhi layar ponsel.
