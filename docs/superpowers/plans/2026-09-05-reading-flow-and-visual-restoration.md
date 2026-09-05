# Rencana Aksi: Pembaruan Alur Baca Adaptif, Restorasi Prolog/Epilog & Regenerasi Cover Bab
**Dokumen Rencana Tunggal (*Single Source of Truth*)**
*Tanggal: 5 September 2026 | Repositori: R:\flip-book*

---

## 1. Latar Belakang & Tujuan
Berdasarkan evaluasi pengalaman membaca (*reader experience*) dan visual:
1. **Alur Baca Belum Alami**: Setiap kali berpindah halaman, pembaca selalu disodori poster (Side A) dan harus membalik kartu secara manual untuk membaca teks (Side B). Pada buku bacaan naskah, halaman isi harus langsung menyajikan **Teks (Side B)** secara default, sedangkan poster (Side A) menjadi default hanya pada **Halaman Pembuka Bab** (`page_in_chap === 1`).
2. **Prolog & Epilog Terlalu Ringkas**: Naskah dipotong menjadi 1 paragraf pendek (~60 kata). Perlu diperluas menjadi 3 paragraf esensial dari naskah asli dengan scroll halus (*smooth momentum scroll*).
3. **Cover Bab 2, 3, 5 "Jeglek" & Berbau SaaS**: Cover Bab 2, 3, dan 5 masih berformat "Visual Masterclass", font metalik kaku, diagram DNA 3D, dan retakan beton dengan logo *Gemini Notebook*. Harus diregenerasi agar seragam dengan estetika seni Bab 1 & Bab 4 (Charcoal `#0d0d0c`, pendar emas `#c5a059`, tipografi sastra editorial Nusantara).

---

## 2. Rincian Perubahan Komponen

### Modul A: Alur Baca Adaptif (`src/screens/reader/reader.ts`)
- Ubah state reset saat navigasi (`goToPage` dan `show`):
  - Jika `page_in_chap === 1` (Hal 1, 16, 31, 46, 60): `this.activeSide = "A"` (Poster dulu).
  - Jika `page_in_chap > 1` (seluruh halaman isi lainnya): `this.activeSide = "B"` (Teks langsung tampil!).
- Sesuaikan teks tombol pembantu:
  - Pada Side A: tombol cue menampilkan `"Baca Naskah →"`.
  - Pada Side B: tombol cue menampilkan `"Lihat Ilustrasi ↺"`.
- Pastikan animasi flip 3D tetap mulus dan sinkron di layar mobile 390px.

### Modul B: Restorasi Layar Prolog & Epilog (`src/screens/prolog.ts`, `src/screens/epilog.ts`, `src/style.css`)
- **Styling (`style.css`)**:
  - Berikan `overflow-y: auto` dan `-webkit-overflow-scrolling: touch` pada `.pe-content-box`.
  - Tambahkan sleek custom scrollbar (warna gold transparan) dan padding bawah yang cukup agar tombol CTA tidak menutupi teks.
- **Prolog (`prolog.ts`)**:
  - Masukkan 3 paragraf esensial dari `naskah-buku/00_Prolog_Kata-Pengantar.md`:
    1. Obrolan warkop kolong jembatan Yogya & Bento Kopi, kopi tubruk dingin, angin malam (bukan seminar motivasi).
    2. Sosok Mas Aldi yang jujur dan santai menghubungkan biologi kortisol dengan wayang & kuantum.
    3. Makna sejati judul buku sebagai pelampung saat hidup oleng di persimpangan gelap.
- **Epilog (`epilog.ts`)**:
  - Masukkan 3 paragraf esensial dari `naskah-buku/06_Epilog_Catatan-Penutup.md`:
    1. Puncak spiritualitas bukanlah melayang atau membaca aura, melainkan sanggup menjadi **manusia normal** yang hadir sepenuhnya.
    2. Hadir untuk keluarga: anak-anak tak butuh teori torus saat takut malam hari; mereka butuh kehadiran utuh kita.
    3. Kepulangan batin: menutup lembaran buku, menapak bumi, dan menghadapi hidup nyata dengan damai.

### Modul C: Regenerasi Artwork Cover Bab 2, 3, 5
- Menggunakan tool generasi gambar untuk menghasilkan 3 slide potret 9:16 berestetika editorial Nusantara:
  - **Cover Bab 2 (`public/slides-portrait/bab-02/slide-1.jpg`)**:
    - *Prompt*: Atmospheric Indonesian editorial art book cover, 9:16 portrait. Deep dark charcoal `#0d0d0c` and soot black background. Center features an ethereal translucent human head in serene night meditation, glowing subtle golden Theta brainwaves in the midbrain, delicate sacred water ripples expanding beneath, mysterious soft silhouette of ancient Javanese gunungan wayang dissolving in atmospheric mist. Warm gold `#c5a059` accents, sacred geometry, fine film grain, oil painting texture, elegant, introspective, dark fine art, no text, no watermark.
  - **Cover Bab 3 (`public/slides-portrait/bab-03/slide-1.jpg`)**:
    - *Prompt*: Atmospheric Indonesian editorial art book cover, 9:16 portrait. Deep dark charcoal `#0d0d0c` background. Sacred vintage anatomical lithograph of a human spine glowing with radiant golden bio-electric energy connecting seven natural endocrine gland stations. Subtle warm steam from volcanic Merapi soil and traditional herbs, delicate sacred geometry rings, mystical ancient aesthetic, rich earth ochre and warm amber light, no text, no modern 3D plastic DNA, no watermark.
  - **Cover Bab 5 (`public/slides-portrait/bab-05/slide-1.jpg`)**:
    - *Prompt*: Atmospheric Indonesian editorial art book cover, 9:16 portrait. Deep dark charcoal `#0d0d0c` with dusky twilight ambience. A humble Javanese wooden veranda at sunset, a steaming ceramic cup of jasmine tea on a rustic teak table, a gentle silhouette of an ordinary person sitting in serene contemplation looking out at the golden twilight sky, soft warm golden torus light glowing gently in the chest cavity. Grounded, peaceful, sacred ordinary life, fine film grain, warm chiaroscuro, no text, no watermark.
- Update `src/data/book-pages.json`:
  - Bersihkan kata *"Visual Masterclass"* dari `illustration_description`, `imageCaption`, dan `subtitle` di Halaman 16, 31, dan 60.

---

## 3. Protokol Eksekusi Paralel (Zero Collision)
Pekerjaan dibagi menjadi subagent paralel:
1. **Agent 1 (UI & Alur Baca)**: Mengerjakan Modul A (`src/screens/reader/reader.ts`) dan Modul B (`src/screens/prolog.ts`, `src/screens/epilog.ts`, `src/style.css`).
2. **Agent 2 (Visual Generation & Metadata)**: Menjalankan generasi gambar untuk Cover Bab 2, 3, 5, menempatkan file ke `public/slides-portrait/`, dan memperbarui metadata di `src/data/book-pages.json`.

---

## 4. Verifikasi & Quality Gate
1. `npm run typecheck` (`tsc --noEmit`) -> EXIT CODE 0
2. `npm run build` (`vite build`) -> Sukses bundle
3. Verifikasi Alur:
   - Hal 1 (Buka Bab 1): Tampil gambar (Side A) -> Flip ke teks (Side B).
   - Hal 2 (Isi Bab 1): Langsung tampil teks (Side B) -> Flip ke gambar (Side A).
   - Hal 16 (Buka Bab 2): Tampil gambar (Side A) -> Flip ke teks (Side B).
   - Hal 17 (Isi Bab 2): Langsung tampil teks (Side B).
4. Verifikasi Teks: Prolog & Epilog bisa di-scroll dengan mulus dan memuat 3 paragraf esensial.
5. Verifikasi Gambar: 3 cover baru seragam dengan gaya Bab 1 & Bab 4 tanpa teks generic.
