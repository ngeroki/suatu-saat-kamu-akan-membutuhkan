# Design Specification: Dynamic Chapter Opening Gates di Daftar Isi & Reader

## 1. Latar Belakang & Masalah
Di versi sebelumnya, halaman pertama pada setiap bab (Hal 01, 16, 31, 46, 60) dilabeli secara kaku dengan badge:
`SAMPUL & PEMBUKA`
dan judul baris di Bab 1 tertulis `SUATU SAAT` (mengulang judul buku secara generik).

Hal ini menimbulkan kesan teknis/administratif seperti draf percetakan, bukan sebuah karya digital editorial spiritual yang bernyawa. Pengguna menginginkan pembuka bab di Daftar Isi yang **sederhana, dinamis (berbeda di tiap bab), dan langsung mencerminkan isi babnya**.

---

## 2. Kesepakatan Desain (Hasil Sesi Grill-Me)

### A. Pola Struktur di Daftar Isi
1. Halaman 01 tetap hadir sebagai baris pertama di dalam dropdown accordion masing-masing bab.
2. Badge lama `"SAMPUL & PEMBUKA"` dieliminasi 100%.
3. Badge dirombak menjadi **Konsep Gerbang/Kunci Bab Dinamis** (`GERBANG [TEMA]`).
4. Judul baris di Halaman 01 diubah secara konsisten menjadi **Judul Besar Bab itu sendiri**.

### B. Pemetaan Detail 5 Lembaran Pembuka (Hal 01, 16, 31, 46, 60)

| No Bab | Hal Global (Hal Bab) | Badge Dinamis | Judul Baris (Judul Bab) | Subjudul |
|---|---|---|---|---|
| **Bab 1** | Hal 01 (Hal 01) | `GERBANG RAGA` | **Anatomi Tubuh Energi & Memori Karma** | *Tubuh, Pikiran, Leluhur, dan Seni Berserah* |
| **Bab 2** | Hal 16 (Hal 01) | `GERBANG BAWAH SADAR` | **Meretas Pikiran Bawah Sadar & Reprogramming Nasib** | *Kita bisa sangat ingin sesuatu, sambil diam-diam takut mendapatkannya...* |
| **Bab 3** | Hal 31 (Hal 01) | `GERBANG BIOHACKING` | **Sistem Hormon, Biohacking Leluhur & Energi Fisik** | *Di balik gampang marah, gelisah, dan lelah, ada tubuh yang bekerja lebih keras...* |
| **Bab 4** | Hal 46 (Hal 01) | `GERBANG KUANTUM` | **Fisika Kuantum, Relativitas & Keterhubungan Semesta** | *Di balik ilusi keterpisahan, semua partikel di jagat raya ini terhubung...* |
| **Bab 5** | Hal 60 (Hal 01) | `GERBANG KEPULANGAN` | **Menjadi Manusia Normal & Seni Berserah** | *Setelah mengarungi kedalaman sukma, perjalanan selalu berujung pada hal bersahaja...* |

---

## 3. Tampilan Hasil Akhir di Daftar Isi (`#/bab`)
Ketika pengguna memperluas (*expand*) kartu bab mana pun, baris pertama akan menyajikan informasi yang anggun dan jelas:

```
▼ BAB 01 · ANATOMI TUBUH ENERGI & MEMORI KARMA
  [01]  GERBANG RAGA
        Anatomi Tubuh Energi & Memori Karma                  Hal 01 ›
  [02]  INGATAN PURBA
        Desiran Ganjil di Tubir Jurang                       Hal 02 ›
  ...

▼ BAB 02 · MERETAS PIKIRAN BAWAH SADAR & REPROGRAMMING NASIB
  [01]  GERBANG BAWAH SADAR
        Meretas Pikiran Bawah Sadar & Reprogramming Nasib    Hal 16 ›
  [02]  TITIK REMUK
        Ketertarikan pada Laku Spiritual                     Hal 17 ›
  ...

▼ BAB 03 · SISTEM HORMON, BIOHACKING LELUHUR & ENERGI FISIK
  [01]  GERBANG BIOHACKING
        Sistem Hormon, Biohacking Leluhur & Energi Fisik     Hal 31 ›
  ...

▼ BAB 04 · FISIKA KUANTUM, RELATIVITAS & KETERHUBUNGAN SEMESTA
  [01]  GERBANG KUANTUM
        Fisika Kuantum, Relativitas & Keterhubungan Semesta  Hal 46 ›
  ...

▼ BAB 05 · MENJADI MANUSIA NORMAL & SENI BERSERAH
  [01]  GERBANG KEPULANGAN
        Menjadi Manusia Normal & Seni Berserah               Hal 60 ›
  ...
```

---

## 4. Tampilan di Reader (`ReaderScreen`)
* **Side A (Poster View)**:
  * Mempertahankan Monumental Chapter Gate Typography: `BAB X`, Divider, Judul Bab All Caps, dan Ringkasan Bab.
* **Side B (Reading View)**:
  * Header artikel di Halaman 01 kini bersih menampilkan:
    * Chip: `BAB 0X`
    * Judul Artikel: Judul Besar Bab (misal: *Anatomi Tubuh Energi & Memori Karma*).
    * Subjudul: Refleksi/Subjudul bab yang mengalir alami.

---

## 5. Dampak Data & Komponen
1. `src/data/book-pages.json`: Update entri halaman 1, 16, 31, 46, 60 (`badge` & `title`).
2. `src/data/visual-narrative-74.json`: Sinkronisasi entri halaman 1, 16, 31, 46, 60 agar metadata naratif tetap presisi 1:1.
3. Seluruh skrip uji (`scripts/validate_book.py`, unit test) tetap lolos validasi integritas dataset 74 halaman.
